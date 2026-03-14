import { createKeyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { redisOptions } from "./Config/redis.config";



@Module({
    imports:[ 
        CacheModule.registerAsync({
        isGlobal: true,
        ...redisOptions
//         useFactory: () => {
//             return {
//                 store: createKeyv('redis://localhost:6379'), // local 
// //store:createKeyv('redis://default:VoHATwGYTMpENM3hcKI2Aja9cJky7kwI@redis-17740.c83.us-east-1-2.ec2.cloud.redislabs.com:17740') host
//             }
//         }

    })]
})

export class CoreModule{}