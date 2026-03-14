import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import mongoose, { Types } from "mongoose";
import { CouponsEnums } from "src/Common/Types";
import { CouponUsageRepository } from "src/DB/Repositories/coupon-usage.repository";
import { CouponRepository } from "src/DB/Repositories/coupon.Repository";
import { OrderRepository } from "src/DB/Repositories/order.repository";
import { CreateCouponDto } from "../DTO/coupon.dto";




@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepository: CouponRepository,
  ) {}

  async CreateCoupon(body: CreateCouponDto, authUser){
   const {
    couponCode,
    discountType,
    discountValue,
    maxDiscount,
    minOrderAmount,
    expiresAt,
    usageLimit,
    perUserLimit,
   isActive} = body;

   const coupon = await this.couponRepository.create({
  couponCode,
  discountType,
  discountValue,
  maxDiscount,
  minOrderAmount,
  expiresAt,
  usageLimit,
  perUserLimit,
  isActive,
  usedCount: 0 
});

  return coupon 

  }

}