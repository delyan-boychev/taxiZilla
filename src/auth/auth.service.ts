import { Injectable, Session, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { join, toNamespacedPath } from 'path';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { transport } from './email.transport';
import { JWTPayload } from './jwt-payload';
import { JwtStrategy } from './jwt-strategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as Cryptr from 'cryptr';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService:JwtService,
  ) { };
  async registerUser(registerUserDto: RegisterUserDTO)
  {
    return await this.userRepository.registerUser(registerUserDto);

  }
  async loginUser(email: string, password: string, @Session() session: { token?: string })
  {
    const ver = await this.userRepository.loginUser(email, password);
    if (!ver)
    {
      return false;
    }
    else
    {
      if (ver === "notVerified")
      {
        return ver;
      }
      else
      {
        const payload: JWTPayload = { email };
        const JWTToken = this.jwtService.sign(payload);
        session.token = JWTToken;
        return true;
      }
    }
  }
  async checkUser(@Session() session: { token?: string }, password: string)
  {
    let userJSON = await this.jwtService.decode(session.token);
    if (userJSON === null)
    {
      throw new UnauthorizedException("Unauthorized");  
    }
    else
    {
      return await this.userRepository.checkPassword(userJSON["email"], password);
    }
  }
  async deleteUser(@Session() session: { token?: string }, pass:string)
  {
    let userJSON = await this.jwtService.decode(session.token);
    if (userJSON === null) {
      throw new UnauthorizedException("Unauthorized"); 
    }
    else
    {
      return await this.userRepository.deleteUser(userJSON["email"],pass);  
    }
  }
  async changePassword(@Session() session: { token?: string }, oldPass: string, newPass: string)
  {
    let userJSON = await this.jwtService.decode(session.token);
    if (userJSON === null) {
      throw new UnauthorizedException("Unauthorized"); 
    }
    else
    {
      return await this.userRepository.changePassword(userJSON["email"],oldPass,newPass);  
    }
    
  }
  async getProfile(@Session() session: {token?: string}):Promise<User>
  {
    console.log(session.token);
    let userJSON = await this.jwtService.decode(session.token);
    if (userJSON === null)
    {
      throw new UnauthorizedException("Unauthorised");  
    }
    else
    {
      //console.log(userJSON["email"]);
      const user = await this.userRepository.getProfile(userJSON["email"]);
      return user;
    }
  }
  async verify(code:string)
  {
    const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
    const username = encrypter.decrypt(code);
    let result = await this.userRepository.verifyUser(username);
    return this.getVerifyPage(result);
  }
  getVerifyPage(verified:boolean):string
  {
    const fs = require("fs");
    if(verified === true) return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/verifiedTrue.html")).toString();
    else return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/verifiedFalse.html")).toString();
  }
  async sendVerify(username:string)
  {
    const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
    const link = encrypter.encrypt(username);
    const htmlcode = "<a href='http://localhost:3000/auth/verify/" + link + "'>ТУК</a>"
    const info = await transport.sendMail({
      from: 'Taxi Zilla',
      to: username,
      subject: 'Потвърждение на email',
      text: '',
      html: '<b>За да потвърдиш email адреса си натисни </b>'+htmlcode,
    });
    return "Sended";
  }
}
