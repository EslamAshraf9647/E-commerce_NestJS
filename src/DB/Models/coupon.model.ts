import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import { CouponsEnums } from "src/Common/Types";

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  couponCode: string;

  @Prop({ required: true, enum: CouponsEnums })
  discountType: string;

  @Prop({ required: true })
  discountValue: number;

  @Prop()
  maxDiscount?: number;

  @Prop({ default: 0 })
  minOrderAmount: number;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: null })
  usageLimit?: number;

  @Prop({ default: 1 })
  perUserLimit?: number;

  @Prop({ default: 0 })
  usedCount: number;

  @Prop({ default: true })
  isActive: boolean;
}

 const couponSchema = SchemaFactory.createForClass(Coupon);

 export const CouponModel = MongooseModule.forFeature([{ name: Coupon.name, schema: couponSchema }]);

 export type CouponType =  HydratedDocument<Coupon> & Document