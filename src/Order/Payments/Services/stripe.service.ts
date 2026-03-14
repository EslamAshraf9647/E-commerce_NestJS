import { Injectable } from "@nestjs/common";
import Stripe from "stripe";



@Injectable()
export class StripeService {

    private stripe= new Stripe(process.env.STRIPE_SECRET_KEY as string)

 async createStripeCoupon(discountAmount: number | undefined) {
    if (!discountAmount || discountAmount <= 0) return null;

    const coupon = await this.stripe.coupons.create({
        amount_off: Math.round(discountAmount * 100), // Math.round للحماية من الكسور
        currency: 'egp',
        duration: 'once',
        name: 'Order Discount',
    });
    return coupon.id;
}

    async CraeteCheckoutSession({
        customer_email,
        line_items,
        metadata,
        discounts,
        

    }:Stripe.Checkout.SessionCreateParams) {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email,
            metadata,
            discounts,
            line_items,
            success_url:"http://localhost:9000/success",
            cancel_url:"http://localhost:9000/cancel",
        })
    } 

    async RefundPaymentIntent({
        payment_intent,
        reason,
    }
   
    ){
        return await this.stripe.refunds.create({
            payment_intent,
            reason
        })
    }

}

/**
 * line_items: [{
 *   price_data: {
 *    currency: 'EGP',
 *   product_data: {
 *   name:'Product',
 *   images:[]
 *  },
 *   unit_amount: 100,
 *   },
 * quantity: 1
 * }]
 * discounts: [{
 *  coupon: 'coupon_id'
 * }]
 */