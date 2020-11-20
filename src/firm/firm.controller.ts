import { Body, Controller, Get, Param, Post, Req, ValidationPipe } from '@nestjs/common';
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
  @Post("/loginFirm/")
  async loginFirm(@Req() req,@Body("eik",ValidationPipe)eik:string, @Body("password",ValidationPipe) password:string,session:{token?:string, type?:string,role?:UserRoles})
  {
    let time = 1800000;
    req.session.cookie.expires = new Date(Date.now()+time);
    return await this.firmService.loginFirm(eik,password,session);
  }
}
