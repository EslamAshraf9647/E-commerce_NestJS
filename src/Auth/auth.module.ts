import { Module } from '@nestjs/common';
import { AuthController } from './Controllers/auth.controller';
import { AuthService } from './Services/auth.service';
import { UserModel } from 'src/DB/Models/user.model';
import {OTPRepository,RevokedTokensRepository,UserRepository,} from 'src/DB/Repositories';
import { TokenService } from 'src/Common/Services';
import { JwtService } from '@nestjs/jwt';
import { OTPModel, RevokedTokensModel } from 'src/DB/Models';

@Module({
  imports: [UserModel, OTPModel, RevokedTokensModel],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    TokenService,
    JwtService,
    OTPRepository,
    RevokedTokensRepository,
  ],
  exports: [],
})
export class AuthModule {}
