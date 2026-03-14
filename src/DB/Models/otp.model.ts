import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';
import { OTPTypes } from 'src/Common/Types';

@Schema({ timestamps: true })
export class OTP {
  @Prop({
    type: String,
    required: true,
  })
  otp: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId: string | Types.ObjectId;

  @Prop({
    type: Date,
  })
  expiryTime: Date;

  @Prop({
    type: String,
    enum: OTPTypes,
  })
  otpType: string;
}

const OTPSchema = SchemaFactory.createForClass(OTP);

export const OTPModel = MongooseModule.forFeature([
  { name: OTP.name, schema: OTPSchema },
]);

export type OTPType = HydratedDocument<OTP> & Document;
