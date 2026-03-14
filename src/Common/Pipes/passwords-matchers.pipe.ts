import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PasswordsMatchersPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.password !== value.ConfirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    console.log({ value, metadata });

    return value;
  }
}
