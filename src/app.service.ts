import { BadRequestException, Injectable } from '@nestjs/common';
import { AppBodyDto } from './app.dto';
import { AppBodyType } from './app.schema';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  sendData(body: AppBodyType) {
    if (!body.email) {
      throw new BadRequestException('User field is required');
    }
    return { message: 'Data received successfully', body };
  }
}
