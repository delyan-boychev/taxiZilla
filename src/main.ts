import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { response } from 'express';
import { join } from 'path';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter, HttpExceptionFilter2 } from './http-exception.filter';

async function bootstrap() {
  const fs = require('fs');
  const keyFile  = fs.readFileSync(__dirname + '/../ssl/privatekey.pem',  'utf8');
  const certFile = fs.readFileSync(__dirname + '/../ssl/cert.pem',  'utf8');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});
  app.useStaticAssets(join(__dirname, "/../staticFiles/"))
  app.useGlobalFilters(new HttpExceptionFilter(), new HttpExceptionFilter2())
  app.use(helmet.contentSecurityPolicy({directives:{
    "default-src": "'self'",
    "img-src": ["*", "'self'", "data:"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "script-src": ["'self'", "'unsafe-inline'"],
  }}));
  app.use(helmet.xssFilter())
  app.use(helmet({contentSecurityPolicy: false}));
  await app.listen(80);
}
bootstrap();
