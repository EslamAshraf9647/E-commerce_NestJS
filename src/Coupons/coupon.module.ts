import { Module } from "@nestjs/common";
import { Coupon, CouponModel } from "src/DB/Models/coupon.model";
import { CouponUsageModel } from "src/DB/Models/couponUsage.model";
import { CouponController } from "./Controller/coupon.controller";
import { CouponService } from "./Services/coupon.service";
import { CouponUsageRepository } from "src/DB/Repositories/coupon-usage.repository";
import { CouponRepository } from "src/DB/Repositories/coupon.Repository";
import { OrderRepository } from "src/DB/Repositories/order.repository";
import { orderModel } from "src/DB/Models";



@Module({
    imports: [ CouponModel],
    controllers: [CouponController],
    providers: [CouponService, CouponRepository],
    exports: []

})
export class CouponModule {}