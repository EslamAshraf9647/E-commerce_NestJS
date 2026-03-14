import {BadRequestException,ConflictException,Injectable,InternalServerErrorException,NotFoundException,UnauthorizedException,} from '@nestjs/common';
import {OTPRepository,RevokedTokensRepository,UserRepository,} from 'src/DB/Repositories';
import {ConfirmEmailBodyDto,ForgetPawsswordBodyDto,ResendOtpBodyDto,ResetPasswoedBodyDto,SignInBodyDto,SignUpBodyDto,} from '../DTO/auth.dto';
import { Events } from 'src/Common/Utils';
import { CompareHash } from 'src/Common/Security';
import { TokenService } from 'src/Common/Services';
import { v4 as uuid4 } from 'uuid';
import ms from 'ms';
import { IAuthUser, OTPTypes } from 'src/Common/Types';
import { emailTemplate } from 'src/Common/Utils/email-templete.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly otpRepository: OTPRepository,
    private readonly revokedTokensRepository: RevokedTokensRepository,
  ) {}

  async SignUpService(body: SignUpBodyDto) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        phoneNumber,
        DOB,
        gender,
        ConfirmPassword,
      } = body;

      const user = await this.userRepository.findByEmail(email);

      if (user) {
        throw new ConflictException('User already exists');
      }

      const newUser = await this.userRepository.create({
        firstName,
        lastName,
        email,
        password,
        role,
        phoneNumber,
        DOB,
        gender,
      });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.otpRepository.CreateOtp({
        userId: newUser._id,
        otp,
        otpType: OTPTypes.EMAIL_VERIFICATION,
      });

      Events.emit('sendEmail', {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        html: emailTemplate(firstName, otp, 'verify your email'),
      });

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async ConfirmEmailService(body: ConfirmEmailBodyDto) {
    const { email, otp } = body;

    // Find the user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Retrieve the active OTP for EMAIL_VERIFICATION
    const ReturnedOtp = await this.otpRepository.findOne({
      filters: {
        userId: user._id,
        otpType: OTPTypes.EMAIL_VERIFICATION,
      },
    });
    if (!ReturnedOtp) {
      throw new NotFoundException('OTP not found');
    }

    // Compare the input OTP with the hashed OTP in the database
    if (!CompareHash(otp, ReturnedOtp.otp)) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check OTP expiry
    if (ReturnedOtp.expiryTime < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    // Update user's email verification status
    user.isEmailVerified = true;
    await this.userRepository.save(user);

    // Remove all old OTPs of this type
    await this.otpRepository.deleteMany({
      userId: user._id,
      otpType: OTPTypes.EMAIL_VERIFICATION,
    });

    // Return a success message
    return { message: 'Email confirmed successfully' };
  }

  async ResendOtpService(body: ResendOtpBodyDto) {
    const { email } = body;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // invalidate all old OTPs FIRST
    await this.otpRepository.deleteMany({
      userId: user._id,
      otpType: OTPTypes.EMAIL_VERIFICATION,
    });

    // generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpRepository.CreateOtp({
      userId: user._id,
      otp,
      otpType: OTPTypes.EMAIL_VERIFICATION,
    });

    Events.emit('sendEmail', {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: emailTemplate(user.firstName, otp, 'verify your email'),
    });

    return { message: 'OTP resent successfully' };
  }

  async LoginService(body: SignInBodyDto) {
    try {
      const { email, password } = body;
      const user = await this.userRepository.findByEmail(email);
      if (!user || !CompareHash(password, user.password)) {
        throw new NotFoundException('User  not Found');
      }

      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email first');
      }

      const tokenPayload = {
        _id: user._id,
        email: user.email,
        role: user.role,
      };

      const accesstoken = this.tokenService.generateToken(tokenPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.EXPERATION_ACCESS_TOKEN as ms.Stringvalue,
        jwtid: uuid4(),
      });

      const refreshToken = this.tokenService.generateToken(tokenPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.EXPERATION_REFRESH_TOKEN as ms.Stringvalue,
        jwtid: uuid4(),
      });

      return { accesstoken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async RefeshTokenService(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token is required');

    const decodedRefreshToken = await this.tokenService.verfiyToken(
      refreshToken,
      { secret: process.env.REFRESH_TOKEN_SECRET },
    );

    const isRefreshTokenRevoked = await this.revokedTokensRepository.findOne({
      filters: { tokenId: decodedRefreshToken.jti },
    });
    if (isRefreshTokenRevoked)
      throw new BadRequestException(
        'Refresh token is revoked, please login again',
      );

    const user = await this.userRepository.findOne({
      filters: { _id: decodedRefreshToken._id },
    });
    if (!user)
      throw new NotFoundException('User not found, please register first');

    const accesstoken = this.tokenService.generateToken(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.EXPERATION_ACCESS_TOKEN as ms.Stringvalue,
        jwtid: uuid4(),
      },
    );

    return { accesstoken };
  }

  async ForgetPasswordService(body: ForgetPawsswordBodyDto) {
    const { email } = body;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpRepository.CreateOtp({
      userId: user._id,
      otp,
      otpType: OTPTypes.PASSWORD_RESET,
    });
    Events.emit('sendEmail', {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your password',
      html: emailTemplate(user.firstName, otp, 'reset your password'),
    });
    return { message: 'Password reset OTP sent to your email' };
  }

  async ResetPasswordService(body: ResetPasswoedBodyDto) {
    const { email, otp, newPassword, ConfirmPassword } = body;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ReturnedOtp = await this.otpRepository.findOne({
      filters: {
        userId: user._id,
        otpType: OTPTypes.PASSWORD_RESET,
      },
    });
    console.log(ReturnedOtp);

    if (!ReturnedOtp) {
      throw new NotFoundException('OTP not found');
    }

    // compare user input with hashed otp
    const isOtpValid = CompareHash(otp, ReturnedOtp.otp);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }
    if (ReturnedOtp.expiryTime < new Date()) {
      throw new BadRequestException('OTP expired');
    }
    user.password = newPassword;
    await user.save();

    await this.otpRepository.deleteOne({ _id: ReturnedOtp._id });

    return { message: 'Password reset successfully' };
  }

  async logOutService(authUser: IAuthUser) {
    return await this.revokedTokensRepository.create({
      tokenId: authUser.token['jti'],
      userId: authUser.user._id,
      expiryDate: authUser.token['exp'],
    });
  }

}



// async ProfileService(authUser: UserType) {
//   return await this.userRepository.findByEmail(authUser.email);
// }



// delete the otp after successful verification
// await this.otpRepository.deleteOne({ _id: ReturnedOtp._id });
