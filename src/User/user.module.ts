import { Module } from "@nestjs/common";
import { UserModel } from "src/DB/Models";
import { UserController } from "./Controller/user.controller";
import { UserService } from "./Service/user.service";
import { UserRepository } from "src/DB/Repositories";



@Module({
    imports:[UserModel],
    controllers:[UserController],
    providers:[UserService, UserRepository],
    exports:[]
})

export class UserModule {}