import { Module } from "@nestjs/common";
import { Cart, CartModel, orderModel, ProductModel } from "src/DB/Models";
import { OrderController } from "./Controller/order.controller";
import { OrderService } from "./Service/order.service";
import { OrderRepository } from "src/DB/Repositories/order.repository";
import { CartService } from "src/Cart/Service/cart.service";
import { CartRepository, ProductRepository } from "src/DB/Repositories";
import { CouponModel } from "src/DB/Models/coupon.model";
import { CouponUsageModel } from "src/DB/Models/couponUsage.model";
import { CouponRepository } from "src/DB/Repositories/coupon.Repository";
import { CouponUsageRepository } from "src/DB/Repositories/coupon-usage.repository";
import { StripeService } from "./Payments/Services";



@Module({
    imports:[orderModel,CartModel,ProductModel, CouponModel, CouponUsageModel],
    controllers:[OrderController],
    providers:[OrderService, OrderRepository,ProductRepository,CartRepository,
        CartService, CouponRepository,CouponUsageRepository,StripeService],
    exports:[OrderService, OrderRepository,ProductRepository,CartRepository,
        CartService, CouponRepository,CouponUsageRepository,StripeService]
})
export class OrderModule{}