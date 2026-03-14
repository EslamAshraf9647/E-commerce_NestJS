import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { Coupon } from "./coupon.model";
import { User } from ".";

export type CouponUsageDocument = CouponUsage & Document;

@Schema({ timestamps: true })
export class CouponUsage {
  @Prop({ type: Types.ObjectId, ref: Coupon.name, required: true })
  couponId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ default: 0 })
  usedCount: number;
}

 const CouponUsageSchema = SchemaFactory.createForClass(CouponUsage);
 CouponUsageSchema.index({ couponId: 1, userId: 1 }, { unique: true });

 export const CouponUsageModel = MongooseModule.forFeature([{ name: CouponUsage.name, schema: CouponUsageSchema }]);

 export type CouponUsageType =  HydratedDocument<CouponUsage> & Document


