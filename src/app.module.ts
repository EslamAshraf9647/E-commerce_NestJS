import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './Auth/auth.module';
import { CategoryModule } from './Category/category.module';
import { GlobalModule } from './global.module';
import { SubCategoryModule } from './Sub-Category/sub-category.module';
import { SubsubCategoryModule } from './Sub_subCategory/sub-sub-category.module';
import { BrandModule } from './Brand/brand.module';
import { ProductModule } from './Product/product.module';
import { BrandCategoryModule } from './BrandCategory/brandcategory.module';
import { CartModule } from './Cart/cart.module';
import { OrderModule } from './Order/order.module';
import { CouponModule } from './Coupons/coupon.module';
import { CoreModule } from './Core/core.module';
import { GQLModule } from './Graphql/graphql.module';
import { CustomThrottlerGuard } from './Common/Guards/custom-throttler.guard';
import { UserModule } from './User/user.module';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL as string),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
      GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:'./src/schema.gql',
      context: ({ req, res }) => ({ req, res })

    }),
    AuthModule,
    GQLModule,
    CategoryModule,
    GlobalModule,
    SubCategoryModule,
    SubsubCategoryModule,
    BrandModule,
    ProductModule,
    BrandCategoryModule,
    CartModule,
    OrderModule,
    CouponModule,
    CoreModule,
    UserModule

    
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: CustomThrottlerGuard,
    // },
  ],
})
export class AppModule {}
