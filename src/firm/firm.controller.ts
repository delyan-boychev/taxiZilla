import { Body, Controller, Get, Param, Post, Req, Session, ValidationPipe } from '@nestjs/common';
import { session } from 'passport';
import { UserRoles } from 'src/auth/enums/userRoles.enum';
import { RegisterFirmDTO } from './dto/registerFirm.dto';
import { FirmService } from './firm.service';

@Controller('firm')
export class FirmController {
  constructor(private firmService:FirmService){};
  @Post("/registerFirm/")
  async registerFirm(@Body(ValidationPipe) registerFirmDto:RegisterFirmDTO)
  {
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
    return this.firmService.getProfile(session);
  }

  @Post("/loginFirm/")
  async loginFirm(@Req() req,@Body("eik",ValidationPipe)eik:string, @Body("password",ValidationPipe) password:string,@Session() session:{token?:string, type?:string,role?:UserRoles})
  {
    let time = 1800000;
    req.session.cookie.expires = new Date(Date.now()+time);
    return await this.firmService.loginFirm(eik,password,session);
  }
  @Post("/addTaxiDriver/")
  async addTaxiDriver(@Session() session:{token?:string, type?:string,role?:UserRoles},@Body("email") email:string)
  {
    return await this.firmService.addTaxiDriver(session,email); 
  }
  @Get("/getTaxiDrivers/")
  async getTaxiDrivers(@Session() session:{token?: string})
  {
    return await this.firmService.getTaxiDrivers(session);
  }
  @Post("/removeTaxiDriver/")
  async removeTaxiDriver(@Session() session:{token?: string}, @Body("email") email:string)
  {
    return await this.firmService.removeTaxiDriver(session, email);
  }
  @Post("/addSupportedCity/")
  async addCity(@Session() session:{token?:string},@Body("city")city:string,@Body("region")region:string)
  {
    return await this.firmService.addCity(city,region,session); 
  }
  @Post("/removeSupportedCity")
  async removeCity(@Session() session:{token?:string},@Body("city")city:string,@Body("region")region:string)
  {
    return await this.firmService.removeCity(city,region,session);
  }
}
