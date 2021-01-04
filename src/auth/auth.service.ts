import { Injectable, Session, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OrderRepository } from "../order/order.repository";
import { InjectRepository } from '@nestjs/typeorm';
import { join, toNamespacedPath } from 'path';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { transport } from '../email.transport';
import { JWTPayload } from './jwt-payload';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as Cryptr from 'cryptr';
import { FirmRepository } from '../firm/firm.repository';
import { UserRoles } from './enums/userRoles.enum';
import { UserStatus } from './enums/userStatus.enum';
import { Drivers, Statuses, x, y, Requests } from 'src/coordsAndStatus.array';
import { taxiDriver } from './taxiDriver.class';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private firmRepository: FirmRepository,
    private jwtService:JwtService,
  ) { };
  async registerUser(registerUserDto: RegisterUserDTO)
  {
    return await this.userRepository.registerUser(registerUserDto);

  }
  async activaterUserByAdmin(@Session()session:{token?:string},userid:number)
  {
    let umail = await this.jwtService.decode(session.token);
    let user = await this.userRepository.findOne({email:umail["email"]});
    return this.userRepository.activateUserByAdmin(user,userid);
  }
  async changeUserRoleAdmin(@Session() session:{token?:string},userid:number,role:UserRoles)
  {
    let umail = await this.jwtService.decode(session.token);
    let user = await this.userRepository.findOne({email:umail["email"]});
    return await this.userRepository.changeUserRoleAdmin(user,userid,role);
  }
  async editUserByAdmin(@Session()session:{token?:string},userid:number,fname:string,lname:string,phoneNumber:string,address:string,email:string)
  {
    let umail = await this.jwtService.decode(session.token);
    let user = await this.userRepository.findOne({email:umail["email"]});
    return await this.userRepository.editUserByAdmin(user,userid,fname,lname,email,phoneNumber,address);
  }
  async removeUserByAdmin(@Session() session:{token?:string},userid:number)
  {
    let umail = await this.jwtService.decode(session.token);
    let user = await this.userRepository.findOne({email:umail["email"]});
    return await this.userRepository.removeUserByAdmin(user,userid);
  }
  async changeStatusAndLocation(@Session() session:{token?:string},newStatus:UserStatus,x:number, y:number)
  {
    let umail = await this.jwtService.decode(session.token);
    let user = await this.userRepository.findOne({email:umail["email"]});
    Statuses[user.id]=newStatus;
    if(newStatus == UserStatus.Busy)
    {
      Drivers[user.id] = undefined;
    }
    else
    {
    if(!Drivers[user.id])
    {
      Drivers[user.id]=new taxiDriver();
    }
    Drivers[user.id].x=x;
    Drivers[user.id].y=y;
    Drivers[user.id].driver = user;
    }
    return await this.getMyOrders(user);
  }
  async getMyOrders(user:User)
    {;
        if(user.role==UserRoles.DRIVER)
        {
            return Requests[user.id]; 
        }
        else
        {
            return false;
        }
    }
  async loginUser(email: string, password: string, @Session() session: { token?: string, type?:string, role?:UserRoles})
  {
    const ver = await this.userRepository.loginUser(email, password,session);
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
        session.type="User";
        session.role=ver.role;
        return true;
      }
    }
  }
  async loginTaxiDriver(email: string, password: string, @Session() session: { token?: string, type?:string, role?:UserRoles})
  {
    const ver = await this.userRepository.loginUser(email, password,session);
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
        if(ver.role !== UserRoles.DRIVER) return false;
        else
        {
        const payload: JWTPayload = { email };
        const JWTToken = this.jwtService.sign(payload);
        session.token = JWTToken;
        session.type="User";
        session.role=ver.role;
        return true;
        }
      }
    }
  }
  async checkUser(@Session() session: { token?: string, type?:string, role:UserRoles }, password: string)
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
  async deleteUser(@Session() session: { token?: string , type?:string, role:UserRoles}, pass:string)
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
  async changePassword(@Session() session: { token?: string , type?:string, role:UserRoles}, oldPass: string, newPass: string)
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
  async getProfile(@Session() session: {token?: string, type?:string, role:UserRoles}):Promise<User>
  {
    let userJSON = await this.jwtService.decode(session.token);
    if (userJSON === null)
    {
      throw new UnauthorizedException("Unauthorised");  
    }
    else
    {
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
  async changeEmail(@Session() session: {token?:string}, newEmail: string)
  {
    let userJSON = await this.jwtService.decode(session.token);
    let stat = await this.userRepository.changeEmail(newEmail, userJSON["email"]);
    this.sendVerify(newEmail);
    return stat;
  }
  async getAllUsers()
  {
    return await this.userRepository.getAllUsers();
  }
  
  async sendVerify(username:string)
  {
    const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
    const link = encrypter.encrypt(username);
    const htmlcode = "<a href='https://taxizilla.cheapsoftbg.com/auth/verify/" + link + "'>ТУК</a>"
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
