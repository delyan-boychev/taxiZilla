import { Injectable, Session } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class AppService {
  getMainPage(): string {
    const fs = require("fs");
  return fs.readFileSync(join(__dirname, "/../staticFiles/pages/index.html")).toString();
  }
  getPrivacyPolicyGoogleApp():string
  {
    const fs = require("fs");
    return fs.readFileSync(join(__dirname, "/../staticFiles/pages/privacyPolicyGoogleApp.html")).toString();
  }
  getPrivacyPolicy():string
  {
    const fs = require("fs");
    return fs.readFileSync(join(__dirname, "/../staticFiles/pages/privacypolicy.html")).toString();
  }
}
