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
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { };
  @Post("/registerUser/")
  async registerUser(@Body(ValidationPipe) registerUserDto:RegisterUserDTO, @Body("key") key:string)
  {
    if(!key) throw new UnauthorizedException();
    if(key.length!=19) throw new UnauthorizedException();
    const date = new Date();
    const d = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() );
    const str = this.authService.decode(key);
    const d2 = new Date(parseInt(str.substr(0, 4)), parseInt(str.substr(6, 2))-1, parseInt(str.substr(4, 2)), parseInt(str.substr(8, 2)), parseInt(str.substr(10, 2)), parseInt(str.substr(12, 2))+10, 0);
    if(d2.toString() == "Invalid date") throw new UnauthorizedException();
    if(d2.getTime()<d.getTime()) throw new UnauthorizedException();
    const registered = await this.authService.registerUser(registerUserDto);
    if(registered===true)
    {
      this.authService.sendVerify(registerUserDto.email);
    }
    return registered;
  }
  @Post("/activateUserByAdmin")
  async activateUserByAdmin(@Session()session:{token?:string}, @Body("userid") userid:number)
  {
    return this.authService.activaterUserByAdmin(session,userid); 
  }
  @Post("/loginUser/")
  async loginUser( @Req() req,@Body("email", ValidationPipe) email: string, @Body("password", ValidationPipe) password: string, @Body("key") key:string, @Session() session: { token?: string, type?:string, role?:UserRoles})
  {
    if(!key) throw new UnauthorizedException();
    if(key.length!=19) throw new UnauthorizedException();
    const date = new Date();
    const d = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() );
    const str = this.authService.decode(key);
    const d2 = new Date(parseInt(str.substr(0, 4)), parseInt(str.substr(6, 2))-1, parseInt(str.substr(4, 2)), parseInt(str.substr(8, 2)), parseInt(str.substr(10, 2)), parseInt(str.substr(12, 2))-10, 0);
    if(d2.toString() == "Invalid date") throw new UnauthorizedException();
    console.log(d2.getTime());
    console.log(d.getTime());
    if(d2.getTime()>d.getTime()) throw new UnauthorizedException();
    let time = 1800000;
    req.session.cookie.expires = new Date(Date.now() + time);
    return await this.authService.loginUser(email, password, session);
  }
  @Post("/changeUserRoleByAdmin")
  async changeUserRoleByAdmin(@Session()session:{token?:string},@Body("userid")userid:number,@Body("role")role:UserRoles)
  {
    return await this.authService.changeUserRoleAdmin(session,userid,role);
  }
  @Post("/removeUserByAdmin")
  async removeUserByAdmin(@Session()session:{token?:string},@Body("userid")userid:number)
  {
    return await this.authService.removeUserByAdmin(session,Number(userid));
  }
  @Post("/editUserByAdmin")
  async editUserByAdmin(@Session()session:{token?:string, },@Body("userid")userid:number,@Body("fName")fname:string,@Body("lName")lname:string,@Body("email")email:string,@Body("address")address:string,@Body("phoneNumber")phoneNumber:string)
  {
    return await this.authService.editUserByAdmin(session,userid,fname,lname,phoneNumber,address,email);
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
    return await this.authService.getAllUsers();
  }

}
