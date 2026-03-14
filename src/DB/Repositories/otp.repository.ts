import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OTP, OTPType } from '../Models';
import { Hash } from 'src/Common/Security/hash.security';
import { OTPTypes } from 'src/Common/Types';
import { DateTime } from 'luxon';

interface ICreateOptions {
  userId: Types.ObjectId;
  otp: string;
  otpType: OTPTypes;
  expiryTime?: Date;
}

@Injectable()
export class OTPRepository extends BaseService<OTPType> {
  constructor(
    @InjectModel(OTP.name) private readonly otpModel: Model<OTPType>,
  ) {
    super(otpModel);
  }

  async CreateOtp({ userId, otp, otpType, expiryTime }: ICreateOptions) {
    return await this.create({
      userId,
      otp: Hash(otp),
      otpType,
      expiryTime: expiryTime
        ? expiryTime
        : DateTime.now().plus({ minutes: 10 }).toJSDate(),
    });
  }
}
