import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import { Cart } from "./cart.model";
import { OrderStatus, PaymentMothods } from "src/Common/Types/types";
import de from "zod/v4/locales/de.js";
import { Coupon } from "./coupon.model";
import { Product } from "./product.model";





@Schema({timestamps: true})
export class Order {
    @Prop({type: Types.ObjectId, ref: User.name, required: true})
    userId: string | Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: Cart.name, required: true})
    cartId: string | Types.ObjectId;

    @Prop({type:Number, required:true})
    totalAmount: number;

    @Prop({type:String, required:true})
    address: string;

    @Prop({type:String, required:true})
    phone: string;

    @Prop({type:String, enum: PaymentMothods, required:true})
    paymentMethod: string;


    @Prop({type:String,enum: OrderStatus,})
    orderStatus: string;

      @Prop({ type: Types.ObjectId, ref: Coupon.name, default: null })
      appliedCoupon?: Types.ObjectId;

      @Prop({ default: 0 })
       discount?: number;

     @Prop({ default: 0 })
      finalAmount?: number;

    @Prop({type: Date , required:true, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}) // Default to 7 days from now
    arrivesAt: Date;


    @Prop({type:{
        paidAt: Date,
        deliveredAt: Date,
        deliveredBy: {type: Types.ObjectId, ref: User.name},
        refundAt: Date,
        refundBy: {type: Types.ObjectId, ref: User.name},
        cancelledAt: Date,
        cancelledBy: {type: Types.ObjectId, ref: User.name},
    }})
    orderChanges: object;

    @Prop({
      type: String
    })
    paymentIntent:string

    @Prop({
  type: [
    {
      productId: {
        type: Types.ObjectId,
        ref: Product.name,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  default: [],
})
orderProducts: {
  productId: Types.ObjectId;
  quantity: number;
}[];

}


  const OrderSchema= SchemaFactory.createForClass(Order)

  export const orderModel = MongooseModule.forFeature([{name: Order.name , schema: OrderSchema}])

  export type OrderType = HydratedDocument<Order> & Document