import { BadRequestException, Body, Controller, Get, Param, Post, Req, Res, Session, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
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
import { session } from 'passport';

@Controller('auth')
export class AuthController {

  //Dependency injection на AuthService
  constructor(
    private authService: AuthService,
  ) { };
  
  //Регистрация на потребител
  @Post("/resetPassword/")
  async resetPassword(@Body("email")email:string, @Body("key") key:string, @Body("offset") offset:string)
  {
    // Декодиране на ключ и валидация
    if(!key) throw new UnauthorizedException();
    if(key.length!=19) throw new UnauthorizedException();
    const date = new Date();
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()+3, date.getUTCMilliseconds() ));
    const str = this.authService.decode(key);
    const d2 = new Date(Date.UTC(parseInt(str.substr(0, 4)), parseInt(str.substr(6, 2))-1, parseInt(str.substr(4, 2)), parseInt(str.substr(8, 2)), parseInt(str.substr(10, 2)), parseInt(str.substr(12, 2)) + 1, 0 + parseInt(offset)));
    const d3 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()-3, date.getUTCMilliseconds()));
    if(isNaN(d2.getTime())) throw new UnauthorizedException();
    if(d2.getTime()>d.getTime() || d3.getTime()>d2.getTime()) throw new UnauthorizedException();
    //=====================================================
    //Същинско регистриране и връщане на обект с данните
    return await this.authService.resetPassword(email);
  }
  @Get("/verifyResetPassword/:email/:pass/:date")
  async verifyResetPassword(@Param("email") email:string, @Param("pass") pass:string, @Param("date") date:string)
  {
    return await this.authService.verifyResetPassword(email, pass, date);
  }
  @Get("/getModeratorOperations")
  async getModeratorOperations(@Session() session:{token?:string, role?:string})
  {
    if(!session.token || session.role!=UserRoles.ADMIN )throw new UnauthorizedException();
    return await this.authService.getModeratorOperations();
  }
  @Post("/registerUser/")
  async registerUser(@Body(ValidationPipe) registerUserDto:RegisterUserDTO, @Body("key") key:string, @Body("offset") offset:string)
  {
    // Декодиране на ключ и валидация
    if(!key) throw new UnauthorizedException();
    if(key.length!=19) throw new UnauthorizedException();
    const date = new Date();
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()+3, date.getUTCMilliseconds() ));
    const str = this.authService.decode(key);
    const d2 = new Date(Date.UTC(parseInt(str.substr(0, 4)), parseInt(str.substr(6, 2))-1, parseInt(str.substr(4, 2)), parseInt(str.substr(8, 2)), parseInt(str.substr(10, 2)), parseInt(str.substr(12, 2)) + 1, 0 + parseInt(offset)));
    const d3 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()-3, date.getUTCMilliseconds()));
    if(isNaN(d2.getTime())) throw new UnauthorizedException();
    if(d2.getTime()>d.getTime() || d3.getTime()>d2.getTime()) throw new UnauthorizedException();
    //=====================================================
    //Същинско регистриране и връщане на обект с данните
    const registered = await this.authService.registerUser(registerUserDto);
    if(registered===true)
    {
      this.authService.sendVerify(registerUserDto.email);
    }
    return registered;
  }

  //Заявка за активиране на потребител
  @Post("/activateUserById")
  async activateUserById(@Session()session:{token?:string, role?:string}, @Body("userid") userid:number)
  {
    if(!session.token ||(session.role != UserRoles.MODERATOR && session.role != UserRoles.ADMIN))throw new UnauthorizedException();
    return this.authService.activaterUserById(session,userid); 
  }
  //Логин на потребител
  @Post("/loginUser/")
  async loginUser( @Req() req,@Body("email", ValidationPipe) email: string, @Body("password", ValidationPipe) password: string, @Body("key") key:string, @Body("offset") offset:string, @Session() session: { token?: string, type?:string, role?:UserRoles})
  {
    // Декодиране на ключ и валидация
    if(!key) throw new UnauthorizedException();
    if(key.length!=19) throw new UnauthorizedException();
    const date = new Date();
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()+3, date.getUTCMilliseconds() ));
    const str = this.authService.decode(key);
    const d2 = new Date(Date.UTC(parseInt(str.substr(0, 4)), parseInt(str.substr(6, 2))-1, parseInt(str.substr(4, 2)), parseInt(str.substr(8, 2)), parseInt(str.substr(10, 2)), parseInt(str.substr(12, 2)) + 1, 0 + parseInt(offset)));
    const d3 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()-3, date.getUTCMilliseconds()));
    if(isNaN(d2.getTime())) throw new UnauthorizedException();
    if(d2.getTime()>d.getTime() || d3.getTime()>d2.getTime()) throw new UnauthorizedException();
    //Създаване на бисквитка и записване на данни в сесията
    let time = 1800000;
    req.session.cookie.expires = new Date(Date.now() + time);
    return await this.authService.loginUser(email, password, session);
  }
  //Смяна на ролята
  @Post("/changeUserRoleByAdmin")
  async changeUserRoleByAdmin(@Session()session:{token?:string, role?:string},@Body("userid")userid:number,@Body("role")role:UserRoles)
  {
    if(!session.token ||session.role != UserRoles.ADMIN)throw new UnauthorizedException();
    return await this.authService.changeUserRoleAdmin(session,userid,role);
  }
  //Изтриване на потребител
  @Post("/removeUserByAdmin")
  async removeUserByAdmin(@Session()session:{token?:string, role?:string},@Body("userid")userid:number)
  {
    if(!session.token ||session.role != UserRoles.ADMIN)throw new UnauthorizedException();
    return await this.authService.removeUserByAdmin(session,Number(userid));
  }
  //Редакция на потребител
  @Post("/editUserByAdmin")
  async editUserByAdmin(@Session() session:{token?:string, role?:string },@Body("userid")userid:number,@Body("fName")fname:string,@Body("lName")lname:string,@Body("email")email:string,@Body("phoneNumber")phoneNumber:string)
  {
    if(!session.token || session.role != UserRoles.ADMIN)throw new UnauthorizedException();
    return await this.authService.editUserByAdmin(session,userid,fname,lname,phoneNumber,email);
  }
  //Влизане като шофьор
  @Post("/loginTaxiDriver/")
  async loginTaxiDriver( @Req() req,@Body("email", ValidationPipe) email: string, @Body("password", ValidationPipe) password: string, @Body("key") key:string, @Body("offset") offset:string, @Session() session: { token?: string, type?:string, role?:UserRoles})
  {
    // Декодиране на ключ и валидация
    if(!key) throw new UnauthorizedException();
    if(key.length!=19) throw new UnauthorizedException();
    const date = new Date();
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()+3, date.getUTCMilliseconds() ));
    const str = this.authService.decode(key);
    const d2 = new Date(Date.UTC(parseInt(str.substr(0, 4)), parseInt(str.substr(6, 2))-1, parseInt(str.substr(4, 2)), parseInt(str.substr(8, 2)), parseInt(str.substr(10, 2)), parseInt(str.substr(12, 2)) + 1, 0 - parseInt(offset)));
    const d3 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()-3, date.getUTCMilliseconds()));
    if(isNaN(d2.getTime())) throw new UnauthorizedException();
    if(d2.getTime()>d.getTime() || d3.getTime()>d2.getTime()) throw new UnauthorizedException();
    let time = 1800000;
    req.session.cookie.expires = new Date(Date.now() + time)
    return await this.authService.loginTaxiDriver(email, password, session);
  }
  //Заявка за взимане на профила на влезлия потребител
  @Get("/profile/")
  async getProfile(@Session() session: { token?: string , type?:string,role:UserRoles})
  {
    if(!session.token || session.type != "User")throw new UnauthorizedException();
    return await this.authService.getProfile(session);
  }
  //Потвърждение на потребител
  @Get("/verify/:code")
  async verify(@Param("code") code:string)
  {
    let verified = await this.authService.verify(code);
    // res.set("verified", verified.toString());
    return verified;
  }
  //Проверка на данните на потребител
  @Post("/checkUser/")
  async checkUser(@Session() session: { token?: string , type?:string,role:UserRoles}, @Body("password") password: string)
  {
    if(!session.token || session.type != "User")throw new UnauthorizedException();
    return this.authService.checkUser(session, password);
  }
  //Смяна на паролата
  @Post("/changePassword/")
  async changePassword(@Session() session: { token?: string , type?:string,role:UserRoles}, @Body("oldPass") oldPass: string, @Body("newPass") newPass: string)
  {
    if(!session.token || session.type != "User")throw new UnauthorizedException();
    return await this.authService.changePassword(session, oldPass, newPass);
  }
  //Смяна на Email адрес
  @Post("/changeEmail/")
  async changeEmail(@Session() session: { token?: string, type?: string}, @Body("newEmail") newEmail: string)
  {
    if(!session.token || session.type != "User")throw new UnauthorizedException();
    return await this.authService.changeEmail(session, newEmail);
  }
  @Get("/getUserAddresses")
  async getUserAddresses(@Session() session:{token?:string, type?:string})
  {
    if(!session.token || session.type != "User")throw new UnauthorizedException();
    return await this.authService.getUserAddresses(session);
  }
  @Post("/saveUserAddress")
  async saveUserAddress(@Session() session:{token?:string, type?:string}, @Body("city") city:string, @Body("address") address:string)
  {
    if(!session.token || session.type != "User")throw new UnauthorizedException();
    if(!city) throw new BadRequestException();
    if(!address) throw new BadRequestException();
    return await this.authService.saveUserAddress(session, city, address);
  }
  @Post("/deleteUserAddress")
  async deleteUserAddress(@Session() session:{token?:string, type?:string}, @Body("addressId") addressId:string)
  {
    if(!session.token || session.type != "User")throw new UnauthorizedException();
    if(!addressId) throw new BadRequestException();
    return await this.authService.deleteUserAddress(session, parseInt(addressId));
  }
  @Post("/getCitiesByFirmId")
  async getCitiesByFirmId(@Session() session:{token?:string, type?:string}, @Body("firmID") firmID:string)
  {
    if(!session.token || session.type != "User") throw new UnauthorizedException();
    return await this.authService.getCitiesByFirmId(parseInt(firmID));
  }
  //Промяна на статус и проверка за поръчки. Само за шофьори
  @Post("/changeStatusAndCheckForOrders/")
  async changeStatusAndLocation(@Session() session:{token?:string, role?:UserRoles}, @Body("newStatus")newStatus:UserStatus, @Body("x") x:string, @Body("y") y:string)
  {
    if(!session.token && session.role != UserRoles.DRIVER)throw new UnauthorizedException();
    let date = new Date();
    return this.authService.changeStatusAndLocation(session,newStatus,parseFloat(x),parseFloat(y));
  }
  @Post("/exitTaxiDriver/")
  exitTaxiDriver( @Body("key") key:string, @Body("driverID") driverID:string, @Body("offset") offset:string, @Body("lastOrderID") lastOrderID:string)
  {
    // Декодиране на ключ и валидация
    if(!key) throw new UnauthorizedException();
    if(key.length!=19) throw new UnauthorizedException();
    const date = new Date();
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()+3, date.getUTCMilliseconds() ));
    const str = this.authService.decode(key);
    const d2 = new Date(Date.UTC(parseInt(str.substr(0, 4)), parseInt(str.substr(6, 2))-1, parseInt(str.substr(4, 2)), parseInt(str.substr(8, 2)), parseInt(str.substr(10, 2)), parseInt(str.substr(12, 2)) + 1, 0 + parseInt(offset)));
    const d3 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()-3, date.getUTCMilliseconds()));
    if(isNaN(d2.getTime())) throw new UnauthorizedException();
    if(d2.getTime()>d.getTime() || d3.getTime()>d2.getTime()) throw new UnauthorizedException();
    return this.authService.exitTaxiDriver(parseInt(driverID), lastOrderID);
  }
  //Взимане на всички потребители
  @Get("/getAllUsers")
  async getAllUsers(@Session() session:{token?:string, role?:UserRoles, type?:string})
  {
    if(!session.token ||(session.role != UserRoles.MODERATOR && session.role != UserRoles.ADMIN))throw new UnauthorizedException();
    return await this.authService.getAllUsers();
  }
  @Post("/editUser/")
  async editUser(@Session() session:{token?:string, role?:UserRoles, type?:string}, @Body("fName") fName:string, @Body("lName") lName:string, @Body("phoneNumber") phoneNumber:string)
  {
    if(!session.token || session.type != "User")throw new UnauthorizedException();
    return await this.authService.editUser(session, fName, lName, phoneNumber);
  }

}
