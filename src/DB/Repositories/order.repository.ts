import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "../base.service";
import { Model, Types } from "mongoose";
import { Order, OrderType } from "../Models";
import { OrderStatus, PaymentMothods } from "src/Common/Types";


@Injectable()
export class OrderRepository extends BaseService<OrderType> {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderType>,
  ) {
    super(orderModel);
  }

  async createOrder(data) {
    console.log(data);
    
    const newOrder = new this.orderModel({
        userId: data.userId,
        cartId: data.cartId,  
        totalAmount: data.totalAmount,
        address: data.address,
        phone: data.phone,
        paymentMethod: data.paymentMethod,
    })

    if(newOrder.paymentMethod === PaymentMothods.CASH_ON_DELIVERY) newOrder.orderStatus= OrderStatus.PLACED
    else newOrder.orderStatus = OrderStatus.PENDING

    return await newOrder.save()
  }
}
