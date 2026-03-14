import { Args, Query, Resolver } from "@nestjs/graphql";
import { OrderService } from "src/Order/Service/order.service";
import { ListOrderFiltersDto, OrderObject } from "../Types/order.types";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Auth, Authuser } from "src/Common/Decorators";
import type { IAuthUser } from "src/Common/Types";
import { RolesEnum } from "src/Common/Types";
import { Throttle } from "@nestjs/throttler";
import { CustomThrottlerGuard } from "src/Common/Guards/custom-throttler.guard";

UsePipes(new ValidationPipe({whitelist: true , forbidNonWhitelisted: true}))
@Resolver()
export class OrderResolver{
    constructor(private readonly orderService: OrderService){}

    @Query(() => String, {name:"RootQueryResolver" , description:"Test Description"})
    rootQueryResolver() {
        return 'test'
    }

    @Query(() => Number, {name:'RootQueryNumber' , description:"return number"})
    rootQueryNumber(){
        return 50
    }
    
    
    @Query(() => [OrderObject], {name:'ListOrders' , description:'get all orders'})
    @Auth(RolesEnum.USER)
     async listorders( 
        @Args('listOrder') ListOrderFilters: ListOrderFiltersDto,
        @Authuser() authUser: IAuthUser
    )
        {
            console.log(ListOrderFilters)
        return await this.orderService.GetOrders(ListOrderFilters ,authUser)
    }
    
}