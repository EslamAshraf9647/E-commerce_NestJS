import { Type } from "class-transformer";
import { IsInt, IsMongoId, IsNumber } from "class-validator";
import { Types } from "mongoose";


export class AddToCartBodyDto {


    @IsMongoId()
    @Type(() => Types.ObjectId ) 
    productId:string | Types.ObjectId;

    
    @IsNumber()
    @IsInt()
    quantity: number

}