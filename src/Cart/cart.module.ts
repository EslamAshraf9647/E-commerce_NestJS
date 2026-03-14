import { Module } from "@nestjs/common";
import { CartModel, ProductModel } from "src/DB/Models";
import { CartController } from "./Controller/cart.controller";
import { CartRepository, ProductRepository } from "src/DB/Repositories";
import { CartService } from "./Service/cart.service";



@Module({
    imports:[CartModel, ProductModel],
    controllers:[CartController],
    providers:[CartRepository,CartService,ProductRepository],
    exports:[]
})

export class CartModule{}