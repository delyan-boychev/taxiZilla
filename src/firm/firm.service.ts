import { Injectable, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { RegisterFirmDTO } from './dto/registerFirm.dto';
import { FirmRepository } from './firm.repository';
import { JWTPayloadFirm } from './jwt2-payload';
import * as Cryptr from 'cryptr';
import { transport } from 'src/email.transport';

@Injectable()
export class FirmService {
    constructor(
        private firmRepository:FirmRepository,
        private jwtService:JwtService,
        ){};
    async loginFirm(eik:string,password:string, @Session() session:{token?: string, type?:string})
    {
    const ver = await this.firmRepository.loginFirm(eik,password);
    if(!ver)
    {
        return false;
    }
    else
    {
        if(ver==="notVerified")
        {
            return ver;
        }
        else if(ver==="notModerationVerified")
        {
            return ver;
        }
        else
        {
            const payload:JWTPayloadFirm = {eik};
            const JWTToken = this.jwtService.sign(payload);
            session.token=JWTToken;
            session.type="Firm";
            return true;
        }
    }
    }
    async registerFirm(registerFirmDto:RegisterFirmDTO)
    {
        return await this.firmRepository.registerFirm(registerFirmDto); 
    }
    async sendVerifyFirm(registerFirmDto:RegisterFirmDTO)
  {
    const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
    const link = encrypter.encrypt(registerFirmDto.eik);
    const htmlcode = "<a href='http://localhost:3000/auth/verifyFirm/"+link+"'>ТУК</a>";
    const info = await transport.sendMail({
      from: "Taxi Zilla",
      to:registerFirmDto.email,
      subject: 'Потвърждение на email',
      html: '<b>За да потвърдиш email адреса си натисни </b>'+htmlcode,
    });
    return "Sended";
  }
  getVerifyPage(verified:boolean):string
  {
    const fs = require("fs");
    if(verified === true) return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/verifiedTrue.html")).toString();
    else return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/verifiedFalse.html")).toString();
  }
  async verifyFirm(code:string)
  {
    const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
    const eik = encrypter.decrypt(code);
    let result = await this.firmRepository.verifyFirm(eik);
    return this.getVerifyPage(result);
  }
}
