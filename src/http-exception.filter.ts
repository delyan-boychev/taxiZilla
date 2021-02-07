import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { join } from 'path';

@Catch(NotFoundException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const fs = require("fs");
    response.send(fs.readFileSync(join(__dirname, "/../staticFiles/pages/404.html")).toString());
  }
}
@Catch(UnauthorizedException)
export class HttpExceptionFilter2<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const fs = require("fs");
    response.send("401");
  }
}
