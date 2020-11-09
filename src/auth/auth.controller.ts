import { Body, Controller, Get, Param, Post, Session, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/registerUser.dto';
import * as nodemailer from 'nodemailer';
import { PrimaryGeneratedColumn } from 'typeorm';
import { transport } from './email.transport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { };
  @Post("/registerUser/")
  async registerUser(@Body(ValidationPipe) registerUserDto:RegisterUserDTO)
  {
    return await this.authService.registerUser(registerUserDto);
  }
  @Post("/loginUser/")
  async loginUser(@Body("email", ValidationPipe) email: string, @Body("password", ValidationPipe) password: string, @Session() session: { token?: string })
  {
    return await this.authService.loginUser(email, password, session);
  }
  @Get("/profile/")
  async getProfile(@Session() session: { token?: string })
  {
    return await this.authService.getProfile(session);
  }
  @Get("/sendVerify/:user")
  async sendVerify(@Param("user") user:string)
  {
    return await this.authService.sendVerify(user);
  }
}
