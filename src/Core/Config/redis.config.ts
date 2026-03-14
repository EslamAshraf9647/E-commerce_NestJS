import KeyvRedis, { Keyv } from "@keyv/redis";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";



export const redisOptions: CacheModuleAsyncOptions = {

    useFactory: async () => {
        const redisStore = new KeyvRedis(process.env.REDIS_URL_LOCAL)
        return {
            store: new Keyv({store: redisStore})
        }
    }
    // useFactory: async () => {
    //     const store = await redisStore({
    //         // password: undefined,
    //         socket: {
    //             host:"localhost",
    //             port: 6379
    //         }
    //     })
    //     return {
    //         store: () => store
    //     } 
    // }
}