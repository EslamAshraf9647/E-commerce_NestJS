import { Type } from 'class-transformer';
import {IsDate,IsEmail,IsEnum,IsMongoId,IsNotEmpty,IsString,IsStrongPassword,Length,Matches,MinLength,Validate,ValidateIf,} from 'class-validator';
import { PasswordsMatchConstraint } from 'src/app.dto';
import { GenderEnum, RolesEnum } from 'src/Common/Types';

export class SignUpBodyDto {
  @IsString({ message: 'firstName must be a string' })
  @IsNotEmpty({ message: 'firstName should not be empty' })
  @MinLength(3, { message: 'firstName must be at least 3 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'firstName must contain at least one letter and one number',
  })
  firstName: string;

  @IsString({ message: 'lastName must be a string' })
  @IsNotEmpty({ message: 'lastName should not be empty' })
  @MinLength(3, { message: 'lastName must be at least 3 characters long' })
  lastName: string;

  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email should not be empty' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'password is not strong enough. It must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
  )
  password: string;

  @ValidateIf((args) => args.password)
  @Validate(PasswordsMatchConstraint)
  ConfirmPassword: string;

  @IsString({ message: 'role must be a string' })
  @IsEnum(RolesEnum, { message: 'role must be either user or admin' })
  role: string;

  @IsEnum(GenderEnum, { message: 'gender must be either male or female' })
  gender: string;

  @IsDate()
  @Type(() => Date)
  DOB: Date;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class SignInBodyDto {
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email should not be empty' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;
  
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'password is not strong enough. It must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
  )
  password: string;
}

export class ConfirmEmailBodyDto {
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email should not be empty' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsString({ message: 'otp must be a string' })
  @IsNotEmpty({ message: 'otp should not be empty' })
  otp: string;
}

export class ForgetPawsswordBodyDto {
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email should not be empty' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;
}

export class ResetPasswoedBodyDto {
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email should not be empty' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsString({ message: 'otp must be a string' })
  @IsNotEmpty({ message: 'otp should not be empty' })
  otp: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'password is not strong enough. It must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
  )
  newPassword: string;

  @ValidateIf((args) => args.password)
  @Validate(PasswordsMatchConstraint)
  ConfirmPassword: string;
}

export class ResendOtpBodyDto {
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email should not be empty' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;
}

export class CreateBrandBodyDto {
  @IsString({ message: 'brand name must be a string' })
  @IsNotEmpty({ message: 'brand name is required' })
  @Length(2, 50, { message: 'brand name must be between 2 and 50 characters' })
  name: string;
}

export class BrandParamDto {
  @IsMongoId({ message: 'Invalid sub category id' })
  @IsNotEmpty({ message: 'sub category id is required' })
  subCategoryId: string;
}