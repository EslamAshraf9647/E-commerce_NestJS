import { Body, Controller, Param, Post, Put, UseGuards } from "@nestjs/common";
import { OrderService } from "../Service/order.service";
import { Auth, Authuser } from "src/Common/Decorators";
import type { IAuthUser } from "src/Common/Types";
import { RolesEnum } from "../../Common/Types";
import { CreateOrderDto } from "../DTO/order.dto";
import { CouponService } from "src/Coupons/Services/coupon.service";
import { CustomThrottlerGuard } from "src/Common/Guards/custom-throttler.guard";


@UseGuards(CustomThrottlerGuard)
@Controller('orders')
export class OrderController {
    constructor( 
        private readonly orderService: OrderService,
    
    ){}

    @Post('create')
    @Auth(RolesEnum.USER)
    async createOrder(
        @Body() data: CreateOrderDto,
        @Authuser() authUser:IAuthUser,  
        ){
        return await this.orderService.CreateOrder(authUser, data)
    }

    @Post('apply/:orderId')
      @Auth(RolesEnum.USER)
        async applyCouponHandler(
            @Body('couponCode') couponCode:string, 
            @Param('orderId') orderId: string,
            @Authuser() authUser: IAuthUser,
        ) {
    
    
        const result = await this.orderService.applyCouponToOrder({
          orderId,
          couponCode,
          authUser,
        });
    
        return {
          success: true,
          message: 'Coupon applied successfully',
          data: result,
        };
      }

      @Post('pay-with-stripe')
      @Auth(RolesEnum.USER)
       async PayWithStripeHandler(
        @Body() data:{orderId:string},
        @Authuser() authUser: IAuthUser,
       ){
        return await this.orderService.PaymentWithStripe(data.orderId , authUser)
       }

       @Post('/webhook')
       async WebhookHandler(@Body() data: any){
        return await this.orderService.WebhookService(data)
       }

       @Put('cancel')
       @Auth(RolesEnum.USER)
       async CancelOrderHandel(
        @Body() data: {orderId: string},
        @Authuser() authuser: IAuthUser,
       ){
        return await this.orderService.CancelOrderService(data.orderId , authuser)
       }

}