import { Body, Controller, Get, Param, Post, Req, Session, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { session } from 'passport';
import { UserRoles } from 'src/auth/enums/userRoles.enum';
import { RegisterFirmDTO } from './dto/registerFirm.dto';
import { FirmService } from './firm.service';

@Controller('firm')
export class FirmController {
  constructor(private firmService:FirmService){};
  @Post("/registerFirm/")
  async registerFirm(@Body(ValidationPipe) registerFirmDto:RegisterFirmDTO, @Body("key") key:string)
  {
    if(!key) throw new UnauthorizedException();
    if(key.length!=19) throw new UnauthorizedException();
    const date = new Date();
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()+3 ));
    const str = this.firmService.decode(key);
    const d2 = new Date(Date.UTC(parseInt(str.substr(0, 4)), parseInt(str.substr(6, 2))-1, parseInt(str.substr(4, 2)), parseInt(str.substr(8, 2)), parseInt(str.substr(10, 2)), parseInt(str.substr(12, 2)), 0));
    const d3 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()-3));
    if(d2.toString() == "Invalid date") throw new UnauthorizedException();
    if(d2.getTime()>d.getTime() || d3.getTime()>d2.getTime()) throw new UnauthorizedException();
    const registered = await this.firmService.registerFirm(registerFirmDto);
    if(registered == true)
    {
      this.firmService.sendVerifyFirm(registerFirmDto);
    }
    return registered;
  }
  @Get('/verifyFirm/:code')
  async verifyFirm(@Param("code")code:string)
  {
    let verified = this.firmService.verifyFirm(code);
    return verified;
  }
  @Get('/profile/')
  async getProfile(@Session() session:{token?:string, type?:string,role?:UserRoles})
  {
    if(!session.token)throw new UnauthorizedException();
    return this.firmService.getProfile(session);
  }

  @Post("/loginFirm/")
  async loginFirm(@Req() req, @Body("key") key:string, @Body("eik",ValidationPipe)eik:string, @Body("password",ValidationPipe) password:string,@Session() session:{token?:string, type?:string,role?:UserRoles})
  {
    if(!key) throw new UnauthorizedException();
    if(key.length!=19) throw new UnauthorizedException();
    const date = new Date();
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()+3 ));
    const str = this.firmService.decode(key);
    const d2 = new Date(Date.UTC(parseInt(str.substr(0, 4)), parseInt(str.substr(6, 2))-1, parseInt(str.substr(4, 2)), parseInt(str.substr(8, 2)), parseInt(str.substr(10, 2)), parseInt(str.substr(12, 2)), 0));
    const d3 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()-3));
    if(d2.toString() == "Invalid date") throw new UnauthorizedException();
    if(d2.getTime()>d.getTime() || d3.getTime()>d2.getTime()) throw new UnauthorizedException();
    let time = 1800000;
    req.session.cookie.expires = new Date(Date.now()+time);
    return await this.firmService.loginFirm(eik,password,session);
  }
  @Post("/addTaxiDriver/")
  async addTaxiDriver(@Session() session:{token?:string, type?:string,role?:UserRoles},@Body("email") email:string)
  {
    if(!session.token)throw new UnauthorizedException();
    return await this.firmService.addTaxiDriver(session,email); 
  }
  @Get("/getTaxiDrivers/")
  async getTaxiDrivers(@Session() session:{token?: string})
  {
    if(!session.token)throw new UnauthorizedException();
    return await this.firmService.getTaxiDrivers(session);
  }
  @Post("/removeTaxiDriver/")
  async removeTaxiDriver(@Session() session:{token?: string}, @Body("email") email:string)
  {
    if(!session.token)throw new UnauthorizedException();
    return await this.firmService.removeTaxiDriver(session, email);
  }
  @Post("/addSupportedCity/")
  async addCity(@Session() session:{token?:string},@Body("city")city:string,@Body("region")region:string)
  {
    if(!session.token)throw new UnauthorizedException();
    return await this.firmService.addCity(city,region,session); 
  }
  @Post("/removeSupportedCity")
  async removeCity(@Session() session:{token?:string},@Body("city")city:string,@Body("region")region:string)
  {
    if(!session.token)throw new UnauthorizedException();
    return await this.firmService.removeCity(city,region,session);
  }
  @Get("/getCitiesByFirm/")
  async getCitiesByFirm(@Session() session:{token?:string})
  {
    if(!session.token) throw new UnauthorizedException();
    return await this.firmService.getCitiesByFirm(session);
  }
  @Get("/getAllCities")
  async getAllCities(@Session() session:{token?:string})
  {
    if(!session.token) throw new UnauthorizedException();
    return await this.firmService.getAllCities();
  }
  @Post("/removeFirmByAdmin")
  async removeFirmByAdmin(@Session() session:{token?:string},@Body("firmID")firmID:string)
  {
    if(!session.token) throw new UnauthorizedException();
    return await this.firmService.removeFirmByAdmin(session,parseInt(firmID));
  }
  @Get("/getAllFirms")
  async getAllFirms(@Session() session:{token?:string, role?:string})
  {
    if(!session.token && session.role != UserRoles.ADMIN) throw new UnauthorizedException();
    return await this.firmService.getAllFirms();
  }
}
