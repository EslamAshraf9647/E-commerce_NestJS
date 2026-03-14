import { Get, Global, Module } from "@nestjs/common";
import { RevokedTokensModel, UserModel } from "./DB/Models";
import { RevokedTokensRepository, UserRepository } from "./DB/Repositories";
import { TokenService } from "./Common/Services";
import { JwtService } from "@nestjs/jwt";
import { GateWayModule } from "./Common/GateWays/gateways.module";

@Global()
@Module({
    imports:[UserModel, RevokedTokensModel,GateWayModule],
    controllers:[],
    providers:[UserRepository, TokenService,JwtService ,RevokedTokensRepository],
    exports:[RevokedTokensRepository, TokenService, JwtService, UserRepository, UserModel, RevokedTokensModel, GateWayModule],

})

export class GlobalModule{}