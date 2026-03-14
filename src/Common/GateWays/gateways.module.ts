import { Module } from "@nestjs/common";
import { RealTimeGateway } from "./websocket.getway"



@Module({
    imports:[],
    controllers:[],
    providers:[RealTimeGateway,],
    exports:[RealTimeGateway,]
})
export class GateWayModule{}