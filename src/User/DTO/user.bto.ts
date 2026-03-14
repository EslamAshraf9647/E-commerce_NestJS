import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length, Matches, Validate, ValidateIf } from "class-validator";
import { PasswordsMatchConstraint } from "src/app.dto";

export class UpdateUserAccountDto {

  @IsOptional()
  @IsString()
  @Length(2, 30)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 30)
  lastName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^01[0-2,5]{1}[0-9]{8}$/, {
    message: "invalid egyptian phone number",
  })
  phoneNumber?: string;

  @IsOptional()
  @IsDateString()
  DOB?: Date;
}

  export class ChangePasswordDto {


    
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
      oldPassword: string;

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

    
      @ValidateIf((args) => args.newPassword)
      @Validate(PasswordsMatchConstraint)
      confirmPassword: string;
    
  }