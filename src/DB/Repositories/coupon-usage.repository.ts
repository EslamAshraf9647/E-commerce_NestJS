import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CouponUsage, CouponUsageType } from '../Models/couponUsage.model';
import { BaseService } from '../base.service';

@Injectable()
export class CouponUsageRepository extends BaseService<CouponUsageType> {
  constructor(@InjectModel(CouponUsage.name) private CouponUsageModel: Model<CouponUsageType>) {
    super(CouponUsageModel);
  }

  findByCouponAndUser(couponId: Types.ObjectId, userId: Types.ObjectId) {
    return this.findOne({ filters: { couponId, userId } });
  }

  incrementUsage(id: string) {
    return this.updateOne({ _id: id }, { $inc: { usedCount: 1 } });
  }
}