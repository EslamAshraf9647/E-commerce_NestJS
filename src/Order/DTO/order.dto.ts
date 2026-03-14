import { IsEnum, IsString } from "class-validator";
import { PaymentMothods } from "src/Common/Types";



export class CreateOrderDto {

    @IsString()
    address: string;

    @IsString()
    phone: string;
   
    @IsEnum(PaymentMothods)
    paymentMethod: string;

}