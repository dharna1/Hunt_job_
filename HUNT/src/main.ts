import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Config from './config/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('hunt/api');
  app.enableCors();
  await app.listen(Config.APP_PORT);
}
bootstrap();
