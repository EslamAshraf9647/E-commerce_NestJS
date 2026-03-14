import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordsMatch', async: false })
export class PasswordsMatchConstraint implements ValidatorConstraintInterface {
  validate(
    confirmPassword: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> | boolean {
    const password = validationArguments.object['newPassword'];
    return confirmPassword === password;
  }
  defaultMessage?(): string {
    return 'ConfirmPassword must match newPassword';
  }
}

export class AppBodyDto {
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

  @IsEnum(['male', 'female', 'other'], {
    message: 'gender must be either male, female, or other',
  })
  gender: string;

  @IsEnum(['user', 'admin'], { message: 'role must be either user or admin' })
  role: string;
}
