import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, CouponType } from '../Models/coupon.model';
import { BaseService } from '../base.service';

@Injectable()
export class CouponRepository extends BaseService<CouponType> {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<CouponType>
) {
    super(couponModel);
  }

  findByCode(code: string) {
    return this.findOne({ filters: { couponCode: code.toUpperCase(), isActive: true } });
  }

  incrementUsedCount(id: string) {
    return this.updateOne({ _id: id }, { $inc: { usedCount: 1 } });
  }
}