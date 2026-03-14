import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response } from 'express';
import { PasswordsMatchersPipe, ZodValidationPipe } from './Common/Pipes';
import { AppBodyDto } from './app.dto';
import { AppBodySchema, type AppBodyType } from './app.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('redirect')
  @Redirect('https://nestjs.com', 301)
  redirectToNest() {}

  @Post('send-data')

  // @UsePipes(new PasswordsMatchersPipe())
  sendData(
    // Express Request and Response
    // @Req() req: Request,

    // @Body('email') email: string,
    // @Query('id',
    //   new DefaultValuePipe(20),
    //   new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE}))
    //   id: number,
    @Body(new ZodValidationPipe(AppBodySchema)) body: AppBodyType,
    @Res() res: Response,
  ) {
    // console.log( typeof id);

    const Result = this.appService.sendData(body);
    res.status(200).json({ Result });
  }
}
