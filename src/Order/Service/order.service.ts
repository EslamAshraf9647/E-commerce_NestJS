import { BadRequestException, Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { CartService } from "src/Cart/Service/cart.service";
import { IAuthUser } from "src/Common/Types/interfaces";
import { OrderRepository } from "src/DB/Repositories/order.repository";
import { CreateOrderDto } from "../DTO/order.dto";
import { CouponRepository } from "src/DB/Repositories/coupon.Repository";
import { CouponUsageRepository } from "src/DB/Repositories/coupon-usage.repository";
import { Types } from "mongoose";
import { CouponsEnums, OrderStatus, PaymentMothods } from "src/Common/Types";
import { StripeService } from "../Payments/Services";
import Stripe from "stripe";
import { CartRepository, ProductRepository } from "src/DB/Repositories";
import path from "path";




@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly cartservice: CartService,
        private readonly cartRepository: CartRepository,
        private readonly couponRepository: CouponRepository,
        private readonly couponUageRepository: CouponUsageRepository,
        private readonly stripeService: StripeService,
        private readonly productRepository: ProductRepository
    ){}

    async CreateOrder(authUser: IAuthUser, data: CreateOrderDto){
        
        const cart = await this.cartservice.getMyCart({authUser})
        if(!cart || !cart.products.length) throw new NotFoundException('Cart is empty')

        const order = await this.orderRepository.createOrder({
            userId: authUser.user._id,
            cartId: cart._id,
            totalAmount: cart.subTotal,
            address: data.address,
            phone: data.phone,
            paymentMethod: data.paymentMethod,
            appliedCoupon: null,
            discount: 0,        
            finalAmount: 0,

        })

        if( order && order.paymentMethod == PaymentMothods.CASH_ON_DELIVERY){
            await this.productRepository.decrementProductStock(cart.products)

          this.cartRepository.updateOne(
           {_id: cart._id},
           {products:[] , subTotal: 0})
        }

        return order

    }


   async applyCouponToOrder({ orderId, couponCode, authUser }) {
  const userId = authUser.user._id;

  const order = await this.orderRepository.findOne({ filters: { _id: orderId } });
  if (!order) throw new NotFoundException('Order not found');
  if (order.orderStatus == OrderStatus.PLACED)
    throw new BadRequestException('Cannot apply coupon to this order status');
  
  const coupon = await this.couponRepository.findByCode(couponCode);
  if (!coupon || !coupon.isActive) throw new BadRequestException('Invalid coupon');
  if (new Date() > coupon.expiresAt) throw new BadRequestException('Coupon expired');

  if (order.totalAmount < coupon.minOrderAmount)
    throw new BadRequestException(`Minimum order amount is ${coupon.minOrderAmount}`);
 
  const usage = await this.couponUageRepository.findByCouponAndUser(
    coupon._id,
    new Types.ObjectId(userId),
  );
  if (coupon.perUserLimit && (usage?.usedCount ?? 0) >= coupon.perUserLimit)
    throw new BadRequestException('You already used this coupon');
  
  let discount = 0;
  if (coupon.discountType === CouponsEnums.PERCENTAGE) {
    discount = order.totalAmount * (coupon.discountValue / 100);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }
  const finalAmount = Math.max(order.totalAmount - discount, 0);

  order.appliedCoupon = coupon._id;
  order.discount = discount;
  order.finalAmount = finalAmount;
  await order.save();
  
  coupon.usedCount += 1;
  await coupon.save();

  if (usage) {
    usage.usedCount += 1;
    await usage.save();
  } else {
    await this.couponUageRepository.create({ couponId: coupon._id, userId, usedCount: 1 });
  }


  return {
    success: true,
    message: "Coupon applied successfully",
    data: {
      orderId: order._id,
      couponId: coupon._id,
      discount,
      finalAmount,
      
    }
  };
   }

  async PaymentWithStripe(orderId: string, user: IAuthUser ){
    const order = await this.orderRepository.findOne({
      filters: {_id:orderId, userId:user.user._id, orderStatus: OrderStatus.PENDING},
      populateArray:[{
        path:"cartId",
        select:"products subTotal",
        populate:[{
          path:"products.productId",
          select:"title finalPrice"
        }]
      }]
    })

    if(!order) throw new NotFoundException('Order Not Found')

       if (order.orderStatus === 'paid') {
        throw new BadRequestException('Order already paid');
       }


      const line_items = order.cartId['products'].map((product) => ({
        
        quantity: product.quantity,
        price_data:{
          currency:"EGP",
          unit_amount: product.finalPrice * 100 ,
          product_data:{
            name:product.productId.title,
            images:[
              'https://res.cloudinary.com/duqnmc14x/image/upload/v1771941726/E-commerce_Nest/Product/hjgg2pa/z8gjctqllenv9gqgagcu.jpg',
              'https://res.cloudinary.com/duqnmc14x/image/upload/v1772008608/E-commerce_Nest/Product/shl8j0s/uzamclgh6pkqint82pls.jpg'

            ]
          }
        }
      }))
    
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
  
  if (order.discount && order.discount > 0) {
    const stripeCouponId = await this.stripeService.createStripeCoupon(order.discount);
    if (stripeCouponId) {
      discounts.push({ coupon: stripeCouponId });
    }
  }
 
  return await this.stripeService.CraeteCheckoutSession({
    customer_email: user.user.email,
    metadata: { orderId: order._id.toString() },
    line_items,
    discounts,  
  });
  }

  async WebhookService(data: any){
    try {
      
    const orderId = data.data.object.metadata.orderId

    const UpdatedOrder=  await this.orderRepository.updateOne(
      {_id: orderId},
      {orderStatus: OrderStatus.PAID, 
      orderChanges: {paidAt: Date.now()},
      paymentIntent: data.data.object.  payment_intent,
      orderProducts: data.data.object.metadata.products
      },
      [{path:"cartId" , select:"products"}]
    )
    
  const products = UpdatedOrder?.cartId['products']

    await this.orderRepository.updateOne(
      {_id: orderId},
      {
        orderProducts: products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity
        }))
      }
    )

    await this.productRepository.decrementProductStock(products)

    this.cartRepository.updateOne(
    {_id: UpdatedOrder?.cartId['_id']},
    {products:[] , subTotal: 0})

    return "Success"

    } catch (error) {
      console.log(error);
    }
  }

  async CancelOrderService(orderId: string , user: IAuthUser){
    const order = await this.orderRepository.findOne({
      filters: {
        _id:orderId,
        userId:user.user._id,
        orderStatus:{$in:[OrderStatus.PENDING , OrderStatus.PLACED , OrderStatus.PAID]}
      }
    })
    if(!order) throw new BadRequestException('order not found')

    const timeDifference = new Date().getTime() - order['createdAt'].getTime()
    const differenceDays = timeDifference / (1000 * 60 * 60 *24)
    if(differenceDays > 1) throw new BadRequestException('Order Cannot be Cancelled')

      await this.orderRepository.updateOne(
        {_id: orderId},
      {
        orderStatus: OrderStatus.CANCELLED,
        orderChanges: {cancelledAt: Date.now() , cancelledBy: user.user._id}

      })

    if(order.paymentMethod == PaymentMothods.CREDIT_CARD ) 
    {
       await this.stripeService.RefundPaymentIntent({
        payment_intent: order.paymentIntent,
        reason:"requested_by_customer",
      }) 

      {
        await this.orderRepository.updateOne(
          {_id: orderId},
          {
            orderStatus: OrderStatus.REFUNDED,
            orderChanges: {refundAt: Date.now() , refundBy: user.user._id}
          }
        )
         await this.productRepository.IncrementProductStock(order.orderProducts)
      }
    }
    return "Success"

  }

  async GetOrders(filters , authUser){
    return await this.orderRepository.find({
      filters:{...filters, userId: authUser.user._id},
      populateArray:[{
        path: 'cartId' , select:'products subTotal',
        populate:[
              { path: 'products.productId', select: 'title description' }
        ]
      }
    ]})
  }



}