import { Field, ID, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { OrderStatus, PaymentMothods } from "src/Common/Types";
import { OrderType } from "src/DB/Models";

registerEnumType(PaymentMothods, {
    name:"PaymentMethodEnum"
})

registerEnumType(OrderStatus, {
    name:"OrderStatusEnum"
})

@ObjectType()
export class ProductsObject {

    @Field(() => String , {nullable: false})
    description: string;

    @Field(() => String , {nullable: false})
    title: string;


}


@ObjectType()
export class CartProductObject {

     @Field(() => ID , {nullable: false})
    _id: Types.ObjectId;

     @Field(() => ProductsObject , {nullable: false})
    productId: Types.ObjectId;

    @Field(() => Number , {nullable: false})
    quantity: number
    
    @Field(() => Number , {nullable: false})
    finalPrice:number

}

@ObjectType()
export class CartObject {

     @Field(() => ID , {nullable: false})
    _id: Types.ObjectId;

    @Field(() => [CartProductObject] , {nullable: false})
    products: CartProductObject []

    
    @Field(() => Number , {nullable: false})
    subTotal: number;
}



@ObjectType()
export class OrderObject implements Partial<OrderType> {

     @Field(() => ID , {nullable: false})
    _id: Types.ObjectId;

    @Field(() => ID , {nullable: false})
    userId: string | Types.ObjectId ;

    @Field(() => CartObject , {nullable: false})
    cartId: string | Types.ObjectId 

    @Field(() => ID , {nullable: true})
    appliedCoupon?: Types.ObjectId ;

    @Field(() => String , {nullable: false})
    address: string ;

    @Field(() => String , {nullable: false})
    phone: string;

    @Field(() => PaymentMothods , {nullable: false})
    paymentMethod: string;

    @Field(() => OrderStatus , {nullable: false})
    orderStatus: string;

    @Field(() => Number , {nullable: false})
    totalAmount: number;

    @Field(() => String , {nullable: true})
    paymentIntent?: string 
    

    @Field(() => Number , {nullable: true})
    discount?: number;

    @Field(() => Number , {nullable: true})
    finalAmount?: number;

}

@InputType()
export class ListOrderFiltersDto {


    @Field(() => OrderStatus , {nullable: true})
    @IsString()
    @IsOptional()
    @IsEnum(OrderStatus)
    orderStatus:OrderStatus
}