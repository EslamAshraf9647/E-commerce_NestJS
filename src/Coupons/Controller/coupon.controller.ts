import { Body, Controller, Param, Post, Res } from "@nestjs/common";
import { CouponService } from "../Services/coupon.service";
import { Auth, Authuser } from "src/Common/Decorators";
import type  { IAuthUser } from "src/Common/Types";
import { RolesEnum } from "../../Common/Types";
import { CreateCouponDto } from "../DTO/coupon.dto";
import type { Response } from "express";




@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}


  @Post('create')
  @Auth(RolesEnum.ADMIN)
  async CreateCoupon(
    @Body() body: CreateCouponDto,
    @Authuser() authUser: IAuthUser,
    @Res() res: Response,
  ){
    const result = await this.couponService.CreateCoupon(body, authUser)
    return res.status(201).json({message:"Coupon Created Sucessfully" , result})
  }
        
    }



