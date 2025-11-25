import 'dotenv/config';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
