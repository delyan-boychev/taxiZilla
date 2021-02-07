import { Injectable, Session, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OrderRepository } from "../order/order.repository";
import { InjectRepository } from '@nestjs/typeorm';
import { join, toNamespacedPath } from 'path';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { transport } from '../email.transport';
import { JWTPayload } from './jwt-payload';
import { User } from './user.entity';
import { SupportedCityRepository } from "../firm/cityRepository";
import { UserRepository } from './user.repository';
import * as Cryptr from 'cryptr';
import { FirmRepository } from '../firm/firm.repository';
import { UserRoles } from './enums/userRoles.enum';
import { UserStatus } from './enums/userStatus.enum';
import { Drivers, Statuses, x, y, Requests } from 'src/coordsAndStatus.array';
import { taxiDriver } from './taxiDriver.class';
import { FirmService } from 'src/firm/firm.service';
import { use } from 'passport';

@Injectable()
export class AuthService {

  //Dependency injection на необходимите неща
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private firmRepository: FirmRepository,
    private jwtService:JwtService,
    private firmService:FirmService,
    private supportedCityRespository:SupportedCityRepository
  ) { };
  generateString(length)//Funkciq za generirane na niz po zadadena duljina
  {
    var result           = '';
    var characters       = '$%!@#^&*()-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ )
    {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  async getCitiesByFirmId(firmID:number)
  {
    const firm = await this.firmRepository.findOne({id: firmID});
    if(firm)
    {
    return await this.supportedCityRespository.getCitiesByFirm(firm);
    }
    else
    {
      return false;
    }
  }
  async resetPassword(email:string)
  {
    const user = await this.userRepository.findOne({email});
    if(user)
    {
    const date = new Date();
    const lastChangePassword = new Date(user.lastChangePassword);
    lastChangePassword.setHours(lastChangePassword.getHours() + 1);
    if(lastChangePassword.getTime()> date.getTime())
    {
      return "too often";
    }
    else
    {
    const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
    const newPass = this.generateString(10);
    date.setHours(date.getHours() + 1);
    const timeStamp = await encrypter.encrypt(date.toString());
    const emcr = await encrypter.encrypt(email);
    const crPass = await encrypter.encrypt(newPass);
    const link = "https://taxizillabg.com/auth/verifyResetPassword/"+emcr+"/"+crPass+"/"+timeStamp;
    const htmlcode = "<a href='" + link + "'>ТУК</a>";
    const info = await transport.sendMail({
      from: 'Taxi Zilla',
      to: email,
      subject: 'Смяна на парола',
      text: '',
      html: '<br>Нова парола: '+newPass+'</br><br>За да я активираш натисни </br>'+htmlcode,
    });
    return "true";
    }
  }
  else
  {
    return "false";
  }
  }
  async verifyResetPassword(email:string,password:string,time:string)
  {
    const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
    const emaddr = await encrypter.decrypt(email);
    const passw = await encrypter.decrypt(password);
    const timeStr=await encrypter.decrypt(time);
    const timeSt = new Date(timeStr);
    const now = new Date();
    const fs = require("fs");
    const user = await this.userRepository.findOne({email: emaddr});
    const lastChangePassword = new Date(user.lastChangePassword);
    lastChangePassword.setHours(lastChangePassword.getHours() + 1);
    if(now.getTime()>timeSt.getTime())
    {
      return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/passwordChangeExpired.html")).toString();
    }
    else if(lastChangePassword.getTime() > now.getTime())
    {
      return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/passwordChangeExpired.html")).toString();
    }
    else
    {
      const bcrypt = require('bcrypt');
      user.lastChangePassword = now.toString();
      user.passHash= await bcrypt.hash(passw,user.salt);
      await user.save();
      return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/passwordChanged.html")).toString();
    }
    
  }
  //Извикване на регистрация
  async registerUser(registerUserDto: RegisterUserDTO)
  {
    return await this.userRepository.registerUser(registerUserDto);

  }
  //Функция която декодира ключа
  decode(data)
  {
    let result="";
    for(let i=6;i<data.length-6;i++)
    {
        let tmp = data.charCodeAt(i);
        tmp-=33;
        result+=("0" + tmp.toString()).slice(-2);
    }
    return result;
  }
  //Добавяне на град като админ
  async addCityByAdmin(@Session()session:{token?:string},firmID:number,city:string,region:string)
  {
    let umail = await this.jwtService.decode(session.token);
    let user = await this.userRepository.findOne({email:umail["email"]});
    if(user.role!=UserRoles.ADMIN)
    {
      throw new UnauthorizedException();
    }
    else
    {
      return await this.firmService.addCityByAdmin(city,region,firmID);
    }
  }
  // Активация на потребител. Взимаме потребителя по email-а кодиран в тоукена и го активираме
  async activaterUserByAdmin(@Session()session:{token?:string},userid:number)
  {
    let umail = await this.jwtService.decode(session.token);
    let user = await this.userRepository.findOne({email:umail["email"]});
    return this.userRepository.activateUserByAdmin(user,userid);
  }
  //Смяна на роля на потребител
  async changeUserRoleAdmin(@Session() session:{token?:string},userid:number,role:UserRoles)
  {
    let umail = await this.jwtService.decode(session.token);
    let u = await this.userRepository.findOne({id:userid});
    if(u.role == UserRoles.DRIVER)
    {
      const firm = await this.firmRepository.findOne({id: u.firmId});
      this.firmRepository.removeTaxiDriver(firm.eik, u, role);
    }
    else
    {
      await this.userRepository.changeUserRoleAdmin(userid,role);
    }
  }
  //Редактиране на потребител като админ
  async editUserByAdmin(@Session()session:{token?:string},userid:number,fname:string,lname:string,phoneNumber:string, email:string)
  {
    let umail = await this.jwtService.decode(session.token);
    let user = await this.userRepository.findOne({email: umail["email"]});
    return await this.userRepository.editUserByAdmin(user,userid,fname,lname,email,phoneNumber);
  }
  //Премахване като админ
  async removeUserByAdmin(@Session() session:{token?:string},userid:number)
  {
    let umail = await this.jwtService.decode(session.token);
    let user = await this.userRepository.findOne({email:umail["email"]});
    return await this.userRepository.removeUserByAdmin(user,userid);
  }
  exitTaxiDriver(driverID:number)
  {
     Drivers[driverID] = undefined;
  }
  //Смяна на статус и локация на шофьор
  async changeStatusAndLocation(@Session() session:{token?:string},newStatus:UserStatus,x:number, y:number)
  {
    const date = new Date();
    let umail = await this.jwtService.decode(session.token);
    let user = await this.userRepository.findOne({email:umail["email"]});
    Statuses[user.id]=newStatus;
    if(newStatus == UserStatus.Busy)
    {
      Drivers[user.id] = undefined;
      //Ако е бизи не ни трябва
    }
    else
    {
    if(!Drivers[user.id])
    {
      Drivers[user.id]=new taxiDriver();
      //ако го няма просто го записваме
    }
    Drivers[user.id].x=x;
    Drivers[user.id].y=y;
    Drivers[user.id].driver = user;
    //Актуализираме координатите и на кой шофьор са
    }
    //Връщаме поръчките
    return await this.getMyOrders(user);
  }
  //Взимане на поръчки на шофьор
  async getMyOrders(user:User)
    {
        if(user.role==UserRoles.DRIVER)
        {
            //Пазим ги в масива Requests
            return Requests[user.id]; 
        }
        else
        {
            return false;
        }
    }
    //Вписване
  async loginUser(email: string, password: string, @Session() session: { token?: string, type?:string, role?:UserRoles})
  {
    const ver = await this.userRepository.loginUser(email, password,session);
    if (!ver)
    {
      return false;
      //Грешни данни
    }
    else
    {
      if (ver === "notVerified")
      {
        return ver;
        //Не потвърден email
      }
      else
      {
        //Вписване създаваме обект и подписваме JWT Token 
        const payload: JWTPayload = { email };
        const JWTToken = this.jwtService.sign(payload);
        //Задаваме данни на сесията
        session.token = JWTToken;
        session.type="User";
        session.role=ver.role;
        //Връщаме true защото всичко е било успешно
        return true;
      }
    }
  }
  //Влизаме като шофьор единствената разлика е проверката дали човекът е шофьор
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
  //Проверка на данните подадени от потребителя
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
  //Смяна на парола
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
  //Взимане на профила
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
  //Потвърждение на потребител
  async verify(code:string)
  {
    //Разкриптираме кода от линка който е потребителското име на човека и го потвърждаваме
    const encrypter = new Cryptr("mXb35Bw^FvCz9MLN");
    const username = encrypter.decrypt(code);
    let result = await this.userRepository.verifyUser(username);
    return this.getVerifyPage(result);
  }
  getVerifyPage(verified:boolean):string
  {
    //Взимане на страницата за потвърждение зависи от това дали се е потвърдил или не.
    const fs = require("fs");
    if(verified === true) return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/verifiedTrue.html")).toString();
    else return fs.readFileSync(join(__dirname, "/../../staticFiles/pages/verifiedFalse.html")).toString();
  }
  //Смяна на email на потребител
  async changeEmail(@Session() session: {token?:string}, newEmail: string)
  {
    let userJSON = await this.jwtService.decode(session.token);
    let stat = await this.userRepository.changeEmail(newEmail, userJSON["email"]);
    this.sendVerify(newEmail);
    return stat;
  }
  //Взимане на всички потребители
  async getAllUsers()
  {
    return await this.userRepository.getAllUsers();
  }
  
  //Функция, която изпраща email за потвърждение. Тук се вижда че реално кода е криптирано потребителско име
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
  async editUser(@Session() session:{token?:string}, fName:string, lName:string, phoneNumber:string)
  {
    let userJSON = await this.jwtService.decode(session.token);
    return await this.userRepository.editUser(userJSON["email"], fName, lName, phoneNumber);

  }
}
