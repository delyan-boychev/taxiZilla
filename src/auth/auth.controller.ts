import { Body, Controller, Get, Param, Post, Req, Res, Session, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/registerUser.dto';
import * as nodemailer from 'nodemailer';
import { PrimaryGeneratedColumn } from 'typeorm';
import { transport } from './email.transport';
import { Response } from 'express';
import { RegisterFirmDTO } from './dto/registerFirm.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { };
  @Post("/registerFirm/")
  async registerFirm(@Body(ValidationPipe) registerFirmDto:RegisterFirmDTO)
  {
    const registered = await this.authService.registerFirm(registerFirmDto);
    if(registered == true)
    {
      this.authService.sendVerifyFirm(registerFirmDto);
    }
    return registered;
  }
  @Get('/verifyFirm/:code')
  async verifyFirm(@Param("code")code:string)
  {
    let verified = this.authService.verifyFirm(code);
    return verified;
  }
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
  async loginUser(@Req() req,@Body("email", ValidationPipe) email: string, @Body("password", ValidationPipe) password: string, @Session() session: { token?: string })
  {
    var hour = 1800000
    req.session.cookie.expires = new Date(Date.now() + hour)
    return await this.authService.loginUser(email, password, session);
  }
  @Get("/profile/")
  async getProfile(@Session() session: { token?: string })
  {
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
  async checkUser(@Session() session: { token?: string }, @Body("password") password: string)
  {
    return this.authService.checkUser(session, password);
  }
  @Post("/deleteUser/")
  async deleteUser(@Session() session: {token?: string}, @Body("password") pass:string)
  {
    return await this.authService.deleteUser(session,pass);
  }
  @Post("/changePassword/")
  async changePassword(@Session() session: { token?: string }, @Body("oldPass") oldPass: string, @Body("newPass") newPass: string)
  {
    return await this.authService.changePassword(session, oldPass, newPass);
  }
}
