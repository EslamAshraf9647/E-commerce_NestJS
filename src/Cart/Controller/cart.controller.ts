import { Body, Controller, Get, Param, Patch, Post, Put, Res } from "@nestjs/common";
import { CartService } from "../Service/cart.service";
import { Auth, Authuser } from "src/Common/Decorators";
import type  { IAuthUser } from "src/Common/Types";
import { AddToCartBodyDto } from "../DTO/cart.dto";




@Controller('cart')
export class CartController{
    constructor(private readonly cartService: CartService){}

    @Post('add-to-cart')
    @Auth('user')
    async AddToCart(
        @Body() body: AddToCartBodyDto,
        @Authuser() authUser: IAuthUser,
    ){
        const result = await this.cartService.AddtoCartService({body, authUser})
        return {result}

    }


    @Patch('remove-from-cart/:productId')
    @Auth('user')
    async RemoveFromCart(
        @Param('productId') productId: string,
        @Authuser() authUser: IAuthUser,
    ){
        const result = await this.cartService.RemoveFromCart({productId, authUser})
        return {result}
}

    @Put('update-cart-quantity/:productId')
    @Auth('user')
    async updateCartQuantity(
        @Param('productId') productId: string,
        @Body() body: { quantity: number },
        @Authuser() authUser: IAuthUser,
    ){
        const result = await this.cartService.updateCartQuantity({productId, quantity: body.quantity, authUser})
        return {result}
}

    @Get('get-cart')
    @Auth('user')
    async getMyCart(@Authuser() authUser: IAuthUser){
        const result = await this.cartService.getMyCart({authUser})
        return {result}
}
}