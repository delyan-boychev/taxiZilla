import { Injectable, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { RegisterFirmDTO } from './dto/registerFirm.dto';
import { FirmRepository } from './firm.repository';
import { JWTPayloadFirm } from './jwt-payload';
import * as Cryptr from 'cryptr';
import { transport } from 'src/email.transport';
import { decode } from 'punycode';
import { UserRoles } from 'src/auth/enums/userRoles.enum';
import { UserRepository } from 'src/auth/user.repository';
import { User } from 'src/auth/user.entity';
import { session } from 'passport';

@Injectable()
export class FirmService {
    constructor(
        private firmRepository:FirmRepository,
        private jwtService:JwtService,
        private userRepository:UserRepository,
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
    const htmlcode = "<a href='http://localhost:3000/firm/verifyFirm/"+link+"'>ТУК</a>";
    const info = await transport.sendMail({
      from: "taxiZilla",
      to:registerFirmDto.email,
      subject: 'Потвърждение на email',
      html: '<b>За да потвърдите email адреса си натиснете</b> '+htmlcode+'<b>!</b>',
    });
    return "Sended";
  }
  getVerifyPage(verified:boolean):string
  {
    const fs = require("fs");
    if(verified === true) return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/verifiedTrue.html")).toString();
    else return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/verifiedFalse.html")).toString();
  }
  async getProfile(@Session() session:{token?: string, type?:string,role?:UserRoles})
  {
    const decoded=await this.jwtService.decode(session.token);
    const eik=decoded["eik"];
    const profile = this.firmRepository.getProfile(eik);
    return profile;
  }
  async verifyFirm(code:string)
  {
    const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
    const eik = encrypter.decrypt(code);
    let result = await this.firmRepository.verifyFirm(eik);
    return this.getVerifyPage(result);
  }
  async addTaxiDriver(@Session() session:{token?: string, type?:string,role?:UserRoles},email:string)
  {
    const driver:User = await this.userRepository.findOne({email});
    if(driver === undefined) return false;
    else{
    const decoded=await this.jwtService.decode(session.token);
    const eik=decoded["eik"];
    return this.firmRepository.addTaxiDriver(eik,driver);
    }
  }
  async removeTaxiDriver(@Session() session:{token?:string}, email:string)
  {
    const driver:User = await this.userRepository.findOne({email});
    const decoded=await this.jwtService.decode(session.token);
    const eik=decoded["eik"];
    return this.firmRepository.removeTaxiDriver(eik,driver);

  }
  async getTaxiDrivers(@Session() session:{token?: string})
  {
    const decoded=await this.jwtService.decode(session.token);
    const eik=decoded["eik"];
    return await this.firmRepository.getTaxiDrivers(eik);
  }
}
