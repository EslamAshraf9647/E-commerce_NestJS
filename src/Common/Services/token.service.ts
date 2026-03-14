import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { RevokedTokensRepository } from 'src/DB/Repositories';
import { UserRepository } from 'src/DB/Repositories/user.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly revokedTokenRepository: RevokedTokensRepository,
  ) {}

  generateToken(payload, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  verfiyToken(token: string, options?: JwtVerifyOptions) {
    return this.jwtService.verify(token, options);
  }


  async ValidateAndVerifyToken(accesstoken : string) {
      const data = this.verfiyToken(accesstoken, {
          secret: process.env.ACCESS_TOKEN_SECRET,
        });
    
        const isTokenRevoked = await this.revokedTokenRepository.findOne({
          filters: { tokenId: data.jti },
        });
        if (isTokenRevoked)
          throw new UnauthorizedException(
            'your session has expired, please login again',
          );
    
        const user = await this.userRepository.findOne({
          filters: { _id: data._id },
        });
        if (!user) throw new NotFoundException('please register first');

        return { user, data };
  }
}
