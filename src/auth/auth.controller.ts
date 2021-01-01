import { Body, Controller, Get, Param, Post, Req, Res, Session, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as nodemailer from 'nodemailer';
import { PrimaryGeneratedColumn } from 'typeorm';
import { transport } from '../email.transport';
import { Response } from 'express';
import * as requestIp from 'request-ip';
import { RegisterFirmDTO } from '../firm/dto/registerFirm.dto';
import { IpAddress } from './ipaddress.decorator';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { UserRoles } from './enums/userRoles.enum';
import { UserStatus } from './enums/userStatus.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { };
  @Post("/registerUser/")
  async registerUser(@Body(ValidationPipe) registerUserDto:RegisterUserDTO)
  {
    const registered = await this.authService.registerUser(registerUserDto);
    if(registered===true)
    {
      this.authService.sendVerify(registerUserDto.email);
    }
    return registered;
  }
  @Post("/loginUser/")
  async loginUser( @Req() req,@Body("email", ValidationPipe) email: string, @Body("password", ValidationPipe) password: string, @Session() session: { token?: string, type?:string, role?:UserRoles})
  {
    let time = 1800000;
    req.session.cookie.expires = new Date(Date.now() + time)
    return await this.authService.loginUser(email, password, session);
  }
  @Post("/removeUserByAdmin")
  async removeUserByAdmin(@Session()session:{token?:string},@Body("userid")userid:number)
  {
    return await this.authService.removeUserByAdmin(session,userid);
  }
  @Post("/loginTaxiDriver/")
  async loginTaxiDriver( @Req() req,@Body("email", ValidationPipe) email: string, @Body("password", ValidationPipe) password: string, @Session() session: { token?: string, type?:string, role?:UserRoles})
  {
    let time = 1800000;
    req.session.cookie.expires = new Date(Date.now() + time)
    return await this.authService.loginTaxiDriver(email, password, session);
  }
  @Get("/profile/")
  async getProfile(@Session() session: { token?: string , type?:string,role:UserRoles})
  {
    if(!session.token)throw new UnauthorizedException();
    return await this.authService.getProfile(session);
  }
  @Get("/verify/:code")
  async verify(@Param("code") code:string)
  {
    let verified = await this.authService.verify(code);
    // res.set("verified", verified.toString());
    return verified;
  }
  @Post("/checkUser/")
  async checkUser(@Session() session: { token?: string , type?:string,role:UserRoles}, @Body("password") password: string)
  {
    if(!session.token)throw new UnauthorizedException();
    return this.authService.checkUser(session, password);
  }
  @Post("/deleteUser/")
  async deleteUser(@Session() session: {token?: string, type?:string,role:UserRoles}, @Body("password") pass:string)
  {
    if(!session.token)throw new UnauthorizedException();
    return await this.authService.deleteUser(session,pass);
  }
  @Post("/changePassword/")
  async changePassword(@Session() session: { token?: string , type?:string,role:UserRoles}, @Body("oldPass") oldPass: string, @Body("newPass") newPass: string)
  {
    if(!session.token)throw new UnauthorizedException();
    return await this.authService.changePassword(session, oldPass, newPass);
  }
  @Post("/changeEmail/")
  async changeEmail(@Session() session: { token?: string }, @Body("newEmail") newEmail: string)
  {
    if(!session.token)throw new UnauthorizedException();
    return await this.authService.changeEmail(session, newEmail);
  }
  @Post("/changeStatusAndCheckForOrders/")
  async changeStatusAndLocation(@Session() session:{token?:string, role?:UserRoles}, @Body("newStatus")newStatus:UserStatus, @Body("x") x:string, @Body("y") y:string)
  {
    if(!session.token && session.role != UserRoles.DRIVER)throw new UnauthorizedException();
    return this.authService.changeStatusAndLocation(session,newStatus,parseFloat(x),parseFloat(y));
  }
  @Get("/getAllUsers")
  async getAllUsers(@Session() session:{token?:string, role?:UserRoles, type?:string})
  {
    if(!session.token && session.role != UserRoles.ADMIN)throw new UnauthorizedException();
    return await this.authService.getAllUsers();
  }
  @Post("/removeUser")
  async removeUser(@Session() session:{token?:string, role?:UserRoles, type?:string}, @Body("email") email:string)
  {
    if(!session.token && session.role != UserRoles.ADMIN) throw new UnauthorizedException();
    return await this.authService.removeUser(email);

  }

}
