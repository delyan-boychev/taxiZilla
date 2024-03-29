import { BadRequestException, Injectable, Session, UnauthorizedException } from '@nestjs/common';
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
import { Firm } from './firm.entity';
import { SupportedCityRepository } from './cityRepository';
import e from 'express';
import { ModOperationRepository } from 'src/auth/modOperation.repository';

@Injectable()
export class FirmService {
    constructor(
        private firmRepository:FirmRepository,
        private jwtService:JwtService,
        private userRepository:UserRepository,
        private cityRepository:SupportedCityRepository,
        private modRepository:ModOperationRepository
        ){};
    decode(data)
    {
      let result="";
    for(let i=6;i<data.length-6;i++)
    {
        let tmp = data.charCodeAt(i);
        tmp-=33;
        result+=("0" + tmp.toString()).slice(-2);
    }
    return result;
    }
    async removeFirmByAdmin(@Session()session:{token?:string},firmID:number)
    {
      let umail = await this.jwtService.decode(session.token);
      const user = await this.userRepository.findOne({ email: umail["email"]}); 
      if(user.role!==UserRoles.ADMIN)
      {
        throw new UnauthorizedException();
      }
      const firm = await this.firmRepository.findOne(firmID);
      firm.drivers.forEach(async(element) => {
        element.role = UserRoles.USER;
        await element.save();
      });
      firm.supportedCities.forEach(async(element) => {
        await this.cityRepository.removeCity(element.city, element.region, firm);
      });
      firm.drivers = [];
      await firm.save();
      await firm.remove();
      return true;
    }
    async moderationVerifyFirm(@Session()session:{token?:string}, firmID:number)
    {
      let umail = await this.jwtService.decode(session.token);
      const user = await this.userRepository.findOne({ email: umail["email"]}); 
      if(user.role!==UserRoles.ADMIN&&user.role!==UserRoles.MODERATOR)
      {
        throw new UnauthorizedException();
      }
      if(user.role==UserRoles.MODERATOR)
      {
        this.modRepository.createNewLogItem(user.email,"потвърди фирма с ID - "+firmID);
      }
      const firm = await this.firmRepository.findOne(firmID);
      firm.moderationVerified = true;
      await firm.save();
      return true;
    }
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
    generateString(length)//Funkciq za generirane na niz po zadadena duljina
    {
      var result           = '';
      var characters       = '$%!@#^&*()-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ )
      {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    async resetPassword(email:string)
    {
      const firm = await this.firmRepository.findOne({email});
      if(firm)
      {
      const date = new Date();
      const lastChangePassword = new Date(firm.lastChangePassword);
      lastChangePassword.setHours(lastChangePassword.getHours() + 1);
      if(lastChangePassword.getTime()> date.getTime())
      {
        return "too often";
      }
      else
      {
      const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
      const newPass = this.generateString(10);
      date.setHours(date.getHours() + 1);
      const timeStamp = encrypter.encrypt(date.toString());
      const emcr = encrypter.encrypt(email);
      const crPass = encrypter.encrypt(newPass);
      const link = "https://taxizillabg.com/firm/verifyResetPassword/"+emcr+"/"+crPass+"/"+timeStamp;
      const htmlcode = "<a href='" + link + "'>ТУК</a>";
      const info =  transport.sendMail({
        from: 'Taxi Zilla',
        to: email,
        subject: 'Смяна на парола',
        text: '',
        html: '<br>Нова парола: '+newPass+'</br><br>За да я активираш натисни </br>'+htmlcode,
      });
      return "true";
      }
    }
    else
    {
      return "false";
    }
    }
    async verifyResetPassword(email:string,password:string,time:string)
    {
      const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
      let emaddr = "";
      let passw = "";
      let timeStr = "";
      try
      {
        emaddr = encrypter.decrypt(email);
        passw = encrypter.decrypt(password);
        timeStr = encrypter.decrypt(time);
      }
      catch(ex)
      {
        return new BadRequestException();
      }

      const timeSt = new Date(timeStr);
      const now = new Date();
      const fs = require("fs");
      const firm = await this.firmRepository.findOne({email: emaddr});
      if(firm)
      {
        const lastChangePassword = new Date(firm.lastChangePassword);
        lastChangePassword.setHours(lastChangePassword.getHours() + 1);
        if(now.getTime()>timeSt.getTime())
        {
          return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/passwordChangeExpired.html")).toString();
        }
        else if(lastChangePassword.getTime() > now.getTime())
        {
          return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/passwordChangeExpired.html")).toString();
        }
        else
        {
          const bcrypt = require('bcrypt');
          firm.lastChangePassword = now.toString();
          firm.passHash= await bcrypt.hash(passw,firm.salt);
          await firm.save();
          return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/passwordChanged.html")).toString();
        }
      }
      else
      {
        return new BadRequestException();
      }
      
    }
  async registerFirm(registerFirmDto:RegisterFirmDTO)
  {
        return await this.firmRepository.registerFirm(registerFirmDto); 
  }
  async getAllCitiesInBG()
  {
    return await this.cityRepository.getAllCitiesInBG();
  }
  async sendVerifyFirm(registerFirmDto:RegisterFirmDTO)
  {
    const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
    const link = encrypter.encrypt(registerFirmDto.eik);
    const htmlcode = "<a href='https://taxizillabg.com/firm/verifyFirm/"+link+"'>ТУК</a>";
    const info = await transport.sendMail({
      from: "taxiZilla",
      to:registerFirmDto.email,
      subject: 'Потвърждение на email',
      html: '<b>За да потвърдите email адреса си натиснете</b> '+htmlcode+'<b>!</b>',
    });
    return "Sended";
  }
  getVerifyPage(verified:string):string
  {
    const fs = require("fs");
    if(verified === "true") return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/verifiedTrue.html")).toString();
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
    let eik = "";
    try
    {
      eik = encrypter.decrypt(code);
    }
    catch(ex)
    {
      return new BadRequestException();
    }
    let result = await this.firmRepository.verifyFirm(eik);
    if(Object.getPrototypeOf(result) !== BadRequestException.prototype)
    {
      return this.getVerifyPage(result.toString());
    }
    else
    {
      return result;
    }
  }
  async addTaxiDriver(@Session() session:{token?: string, type?:string,role?:UserRoles},email:string, licensePlate:string)
  {
    const driver:User = await this.userRepository.findOne({email});
    if(driver === undefined) return false;
    else{
    const decoded=await this.jwtService.decode(session.token);
    const eik=decoded["eik"];
    return await this.firmRepository.addTaxiDriver(eik,driver, licensePlate);
    }
  }
  async removeTaxiDriver(@Session() session:{token?:string}, email:string)
  {
    const driver:User = await this.userRepository.findOne({email});
    const decoded=await this.jwtService.decode(session.token);
    const eik=decoded["eik"];
    return this.firmRepository.removeTaxiDriver(eik,driver, UserRoles.USER);

  }
  async getTaxiDrivers(@Session() session:{token?: string})
  {
    const decoded=await this.jwtService.decode(session.token);
    const eik=decoded["eik"];
    return await this.firmRepository.getTaxiDrivers(eik);
  }
  async addCity(city:string,region:string, @Session() session:{token?: string})
  {
      const decoded=await this.jwtService.decode(session.token);
      const eik=decoded["eik"];
      const firm = await this.firmRepository.findOne({eik});
      return await this.cityRepository.addCity(city,region,firm);
  }
  async addCityByAdmin(city:string,region:string, firmID:number)
  {
    const firm = await this.firmRepository.findOne(firmID);
    return await this.cityRepository.addCity(city,region,firm);
  }
  async addCityByFirmId(@Session()session:{token?: string},city:string, region:string, firmId:number)
  {
    let umail = await this.jwtService.decode(session.token);
    const user = await this.userRepository.findOne({ email: umail["email"]}); 
    if(user.role!==UserRoles.ADMIN&&user.role!==UserRoles.MODERATOR)
    {
      throw new UnauthorizedException();
    }
    if(user.role==UserRoles.MODERATOR)
    {
      this.modRepository.createNewLogItem(user.email,"добави " + city + " област "+region+" в поддържаните населени места на фирма с ID - "+firmId);
    }
    const firm = await this.firmRepository.findOne({id: firmId});
    return await this.cityRepository.addCity(city, region, firm);
  }
  async removeCityById(@Session()session:{token?: string},cityId:number, firmId:number)
  {
    let umail = await this.jwtService.decode(session.token);
    const user = await this.userRepository.findOne({ email: umail["email"]}); 
    if(user.role!==UserRoles.ADMIN&&user.role!==UserRoles.MODERATOR)
    {
      throw new UnauthorizedException();
    }
    if(user.role==UserRoles.MODERATOR)
    {
      this.modRepository.createNewLogItem(user.email,"премахна населено място с ID -  " + cityId + " от поддържаните населени места на фирма с ID - "+firmId);
    }
    const firm = await this.firmRepository.findOne({id: firmId});
    return await this.cityRepository.removeCityById(cityId, firm);
  }
  async removeCity(city:string,region:string, @Session() session:{token?: string})
  {
      const decoded=await this.jwtService.decode(session.token);
      const eik=decoded["eik"];
      const firm = await this.firmRepository.findOne({eik});
      return await this.cityRepository.removeCity(city,region,firm);
  }
  async getCitiesByRegCode(regCode:string)
  {
    return await this.cityRepository.getCitiesInBGByRegion(regCode);
  }
  async getCitiesByFirmId(firmId:number)
  {
    const firm = await this.firmRepository.findOne({id:firmId});
    return await this.cityRepository.getCitiesByFirm(firm);
  }
  async getCitiesByFirm(@Session() session:{token?: string})
  {
    const decoded = await this.jwtService.decode(session.token);
    const eik=decoded["eik"];
    const firm = await this.firmRepository.findOne({eik});
    return await this.cityRepository.getCitiesByFirm(firm);
  }
  async editFirmByAdmin(@Session() session:{token?:string}, firmID:number, firmName:string, eik:string, email:string, phoneNumber:string, address:string, city:string)
  {
    const decoded = await this.jwtService.decode(session.token);
    const user = await this.userRepository.findOne({email: decoded["email"]});
    await this.firmRepository.editFirmByAdmin(user, firmID, eik, firmName, email, phoneNumber, address, city);
  }
  async addTaxiDriverById(@Session() session:{token?:string}, firmID:number, userID:number, licensePlate:string)
  {
    let umail = await this.jwtService.decode(session.token);
    const usera = await this.userRepository.findOne({ email: umail["email"]}); 
    if(usera.role!==UserRoles.ADMIN&&usera.role!==UserRoles.MODERATOR)
    {
      throw new UnauthorizedException();
    }
    if(usera.role==UserRoles.MODERATOR)
    {
      this.modRepository.createNewLogItem(usera.email,"потвърди фирма с ID - "+firmID);
    }
    const firm = await this.firmRepository.findOne({id: firmID});
    const user = await this.userRepository.findOne({id:userID});
    if(firm)
    {
      return this.firmRepository.addTaxiDriver(firm.eik, user, licensePlate);
    }
  }
  async getAllCities()
  {
    return await this.cityRepository.getAllCities();
  }
  async getAllFirms()
  {
    return await this.firmRepository.getAllFirms()
  }
  async changePassword(@Session() session:{token?:string}, oldPass:string, newPass:string)
  {
    const decoded = await this.jwtService.decode(session.token);
    const eik=decoded["eik"];
    return await this.firmRepository.changePassword(eik, newPass, oldPass);
  }
}
