import { IsString, IsNumber, Min, IsOptional, IsDateString, IsBoolean, IsEnum } from 'class-validator';
import { CouponsEnums } from 'src/Common/Types';


export class CreateCouponDto {
  @IsString({ message: 'Coupon code must be a string' })
  couponCode: string;

  @IsEnum(CouponsEnums, { message: 'Discount type must be "fixed" or "percentage"' })
  discountType: string;

  @IsNumber({}, { message: 'Discount value must be a number' })
  discountValue: number;

  @IsOptional()
  @IsNumber({}, { message: 'Max discount must be a number' })
  maxDiscount?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Min order amount must be a number' })
  minOrderAmount?: number = 0;

  @IsDateString({}, { message: 'Expires at must be a valid date string' })
  expiresAt: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Usage limit must be a number' })
  usageLimit?: number 

  @IsOptional()
  @IsNumber({}, { message: 'Per user limit must be a number' })
  perUserLimit?: number = 1;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean = true;
}