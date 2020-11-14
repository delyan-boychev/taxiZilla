import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "/../staticFiles/"))
  app.enableCors({
    origin:"localhost:3000",
  });
  await app.listen(3000);
}
bootstrap();
