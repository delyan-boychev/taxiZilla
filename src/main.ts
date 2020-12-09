import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { response } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const fs = require('fs');
  const keyFile  = fs.readFileSync(__dirname + '/../ssl/privatekey.pem',  'utf8');
  const certFile = fs.readFileSync(__dirname + '/../ssl/cert.pem',  'utf8');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "/../staticFiles/"))
  await app.listen(80);
}
bootstrap();
