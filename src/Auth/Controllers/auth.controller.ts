import { Body, Controller, Get, Patch, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../Services/auth.service';
import {ConfirmEmailBodyDto,ForgetPawsswordBodyDto,ResendOtpBodyDto,ResetPasswoedBodyDto,SignInBodyDto,SignUpBodyDto,} from '../DTO/auth.dto';
import { Authuser } from 'src/Common/Decorators/roles.decorator';
import { Auth } from 'src/Common/Decorators';
import type { IAuthUser } from 'src/Common/Types/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async SignUpHandeler(
    @Body() body: SignUpBodyDto,
    @Res() res: Response) {
    const result = await this.authService.SignUpService(body);
    return res
      .status(201)
      .json({ message: 'User created successfully', data: result });
  }

  @Patch('confirm-email')
  async ConfirmEmailHandeler(
    @Body() body: ConfirmEmailBodyDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.ConfirmEmailService(body);
    return res.status(200).json({ message: 'Email confirmed successfully' });
  }

  @Post('resend-otp')
  async ResendOtpHandeler(
    @Body() body: ResendOtpBodyDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.ResendOtpService(body);
    return res.status(200).json(result);
  }

  @Post('login')
  async SignInHandeler(@Body() body: SignInBodyDto, @Res() res: Response) {
    const result = await this.authService.LoginService(body);
    return res.status(201).json({ message: 'User login successfully', result });
  }

  @Post('refresh-token')
  async RefreshTokenHandeler(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.RefeshTokenService(
      req.headers['refreshtoken'] as string,
    );
    return res
      .status(200)
      .json({ message: 'Token refreshed successfully', result });
  }

  @Post('forget-password')
  async ForgetPasswordHandeler(
    @Body() body: ForgetPawsswordBodyDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.ForgetPasswordService(body);
    return res.status(200).json(result);
  }

  @Patch('reset-password')
  async ResetPasswordHandeler(
    @Body() body: ResetPasswoedBodyDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.ResetPasswordService(body);
    return res.status(200).json(result);
  }

  @Post('logout')
  @Auth('user', 'admin')
  async LogOutHandeler(@Authuser() authUser: IAuthUser, @Res() res: Response) {
    await this.authService.logOutService(authUser);
    res.status(200).json({ message: 'User logged out successfully' });
  }
}



// @Get('profile')
// @Auth('admin')
// async ProfileHandeler(@Authuser() authUser: UserType, @Res() res: Response) {
//   console.log(authUser);

//   const result = await this.authService.ProfileService(authUser);
//   res
//     .status(200)
//     .json({ message: 'User profile retrieved successfully', result });
// }