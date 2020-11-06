import { Injectable, Session } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class AppService {
  getMainPage(): string {
    const fs = require("fs");
  return fs.readFileSync(join(__dirname, "/../staticFiles/pages/index.html")).toString();
  }
}
