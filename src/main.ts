import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PerformanceMonitorInterceptors } from './Common/Interceptors/performance-monitor.interceptor';
import { RequestQueryParseMiddleware } from './Common/middleware/queryparse.middleware'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(RequestQueryParseMiddleware)

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.useGlobalInterceptors(new PerformanceMonitorInterceptors)

  const port = process.env.PORT; 
  await app.listen(port as string, () =>
    console.log(`Server is running on port ${port}`),
  );
}
bootstrap();
