import { Module } from "@nestjs/common";
import { OrderResolver } from "./Resolvers/order.resolver";
import { OrderModule } from "src/Order/order.module";



@Module({
    imports:[OrderModule],
    controllers:[],
    providers:[OrderResolver],
    exports:[]
})

export class GQLModule{}