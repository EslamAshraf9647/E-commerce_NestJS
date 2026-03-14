import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import { Product } from "./product.model";




@Schema({timestamps: true})
export class Cart {
    @Prop({type: Types.ObjectId, ref: User.name, required: true})
    userId: string | Types.ObjectId;


    @Prop({
        type:[{
            productId:{type: Types.ObjectId, ref:Product.name, required: true},
            quantity:{type:Number, default:1},
            finalPrice:{type:Number, required:true}
        }]
    })
    products: {productId: Types.ObjectId, quantity: number, finalPrice:number} []

    @Prop({type:Number})
    subTotal: number;
}


  const cartSchema= SchemaFactory.createForClass(Cart)

  cartSchema.pre('save', async function() {
    this.subTotal = this.products.reduce((total, product) => total + (product.finalPrice * product.quantity), 0)
  }) 

  export const CartModel = MongooseModule.forFeature([{name: Cart.name , schema: cartSchema}])

  export type CartType = HydratedDocument<Cart> & Document