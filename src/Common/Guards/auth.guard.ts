import {CanActivate,ExecutionContext,Injectable,NotFoundException,UnauthorizedException,} from '@nestjs/common';
import { TokenService } from '../Services';
import { RevokedTokensRepository, UserRepository } from 'src/DB/Repositories';
import { IAuthUser } from '../Types';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenaService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    if (context['contextType'] == 'graphql') {
      const request = GqlExecutionContext.create(context).getContext()
     const { accesstoken } = request.req.headers;
      if (!accesstoken) throw new UnauthorizedException('please login first');
  
      const { user, data } =  await this.tokenaService.ValidateAndVerifyToken(accesstoken);
  
      request.authUser = { user, token: data } as IAuthUser;
      
    }
    else if (context['contextType'] == 'http'){
      const request = context.switchToHttp().getRequest();
      const { accesstoken } = request.headers;
      if (!accesstoken) throw new UnauthorizedException('please login first');
  
      const { user, data } =  await this.tokenaService.ValidateAndVerifyToken(accesstoken);
  
      request.authUser = { user, token: data } as IAuthUser;

    }
    
    return true;
  }
}

// async canActivate(context: ExecutionContext): Promise<boolean> {
//   const request = context.switchToHttp().getRequest();
//   const { accesstoken } = request.headers;

//   if (!accesstoken) {
//     throw new UnauthorizedException('please login first');
//   }

//   let data;
//   try {
//     data = this.tokenaService.verfiyToken(accesstoken, {
//       secret: process.env.ACCESS_TOKEN_SECRET,
//     });
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       throw new UnauthorizedException('access token expired');
//     }

//     throw new UnauthorizedException('invalid access token');
//   }

//   const isTokenRevoked = await this.revokedTokenRepository.findOne({
//     filters: { tokenId: data.jti },
//   });

//   if (isTokenRevoked) {
//     throw new UnauthorizedException(
//       'your session has expired, please login again',
//     );
//   }

//   const user = await this.userRepository.findOne({
//     filters: { _id: data._id },
//   });

//   if (!user) {
//     throw new NotFoundException('please register first');
//   }

//   request.authUser = { user, token: data } as IAuthUser;
//   return true;
// }

