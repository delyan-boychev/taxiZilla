import { EntityRepository, Repository } from "typeorm";
import { RegisterUserDTO } from "./dto/registerUser.dto";
import { UserRoles } from "./enums/userRoles.enum";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { Session, UnauthorizedException, UseGuards } from "@nestjs/common";
import e from "express";

//Операции с базата данни
@EntityRepository(User)
export class UserRepository extends Repository<User>
{
  //Регистрация на потребител
  async registerUser(registerUserDto: RegisterUserDTO)
  {
    //Създаваме нов обект от тип User
    let user:User = new User();
    const { fName, lName, email, phoneNumber, password } = registerUserDto;
    const dupUser = await User.findOne({email: email});
    //Проверка за липса на дубликати
    let exists = dupUser==undefined;
    if(exists)
    {
      //Ако няма дубликат задава стойности на новия потребител
      user.email = email;
      user.fName = fName;
      user.lName = lName;
      user.telephone = phoneNumber;
      user.role = UserRoles.USER;
      user.verified = false;
      user.lastChangePassword = "";
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passHash = await bcrypt.hash(password, salt);
      user.passHash = passHash;
      user.salt = salt;
      //Записване в базата данни
      await user.save();
    }
    return exists;
  }
  //Промяна на потребител от админ
  async editUserByAdmin(sender:User,userid:number,fname:string,lname:string,email:string,phoneNumber:string)
  {
    if(sender.role===UserRoles.ADMIN)
    {
      //Ако този който изпраща заявката е админ то намира потребителя, който трябва да се промени.
      const user = await this.findOne(userid);
      //Присвояване на промените и запис в базата данни.
      user.fName=fname;
      user.lName=lname;
      user.email=email;
      user.telephone=phoneNumber;
      await user.save();
      return true;
    }
    else
    {
      //Ако не хвърляме 401 Unauthorized
      throw new UnauthorizedException();
    }
  }
  async editUser(userEmail:string, fName:string, lName:string, phoneNumber:string)
  {
    const user = await this.findOne({email:userEmail});
    user.fName = fName;
    user.lName = lName;
    user.telephone = phoneNumber;
    await user.save();
  }
  //Активация на потребител от админ
  async activateUserByAdmin(sender:User,userid:number)
  {
    if(sender.role===UserRoles.ADMIN)
    {
      //Ако е админ променяме verified на true което потвърждава потребителя и записва в базата данни
      const user = await this.findOne(userid);
      user.verified=true;
      await user.save();
      return true;
    }
    else
    {
      throw new UnauthorizedException();
    }
  }
  //Смяна на роля на потребител
  async changeUserRoleAdmin(userid:number,role:UserRoles)
  {
      const user = await this.findOne(userid);
      user.role = role;
      await user.save();
  }
  //Премахване на потребител от админ
  async removeUserByAdmin(sender:User,userid)
  {
    if(sender.role===UserRoles.ADMIN)
    {
        const user = await this.findOne(userid);
        await user.remove();
        return true;
    }
    else
    {
        throw new UnauthorizedException();
    }
  }
  //Потвърждаване на профила
  async verifyUser(email: string)
  {
    let user: User = await this.findOne({ email });
    if (user.verified)
    {
      return false;  
    }
    else
    {
      user.verified = true;
      await user.save();
      return true;
    }
  }
  //Вписване на потребител
  async loginUser(email: string, password: string, @Session() session: { token?: string, type?:string, role?:UserRoles})
  {
    const user = await this.findOne({ email });
    let hashed = "";
    if (user)
    {
      hashed=await bcrypt.hash(password,user.salt); 
    }
    else
    {
      return undefined;  
    }
    //Сравняваме хеша на паролата с хеша на тази на потребителя
    if (hashed === user.passHash) {
      if (user.verified === true)
      {
        //Ако съвпадат вписването е успешно
        return user; 
      }
      else
      {
        //Ако не е потвърден
        return "notVerified";
      }
    }
    return undefined;
    
  }
  //Взимане на всички потребители
  async getAllUsers()
  {
    let users = await this.find();
    users.forEach(el => {
      delete el.passHash;
      delete el.salt;
    });
    return users;
  }
  //Проверка на паролата
  async checkPassword(email: string, password: string)
  {
    const user = await this.findOne({ email });
    let hashed = "";
    if (user)
    {
      //Хеширане на предполагаемата
      hashed = await bcrypt.hash(password, user.salt);
      //Сравняване на хеш
      if (hashed === user.passHash)
      {
        return true;  
      }
      else
      {
        return false;
      }
    }
    else
    {
      return undefined;
    }
  }
  //Промяна на паролата
  async changePassword(email: string, oldPass: string, newPass: string)
  {
    let user = await this.findOne({ email });
    let hashed = await bcrypt.hash(oldPass, user.salt);
    //Проверка на парола
    if (hashed === user.passHash)
    {
      //Хеширане на новата парола
      let hash2 = await bcrypt.hash(newPass, user.salt);
      //Смяна на хеша и запис
      user.passHash = hash2;
      await user.save();
      return true;
    }
    else
    {
      return false;
    }
  }
  //Промяна на email
  async changeEmail(newEmail: string, email: string)
  {
    let usercheck = await this.findOne({ email: newEmail });
    if(usercheck != undefined) return "emailExists";
    else{
    let user = await this.findOne({ email });
    user.email = newEmail;
    user.verified = false;
    user.save();
    return "true";
    }
  }
  //Изтриване на потребител
  async deleteUser(email:string, pass:string)
  {
    let user = await this.findOne({ email });
    let hashed = await bcrypt.hash(pass, user.salt);
    if (user.passHash === hashed)
    {
      await user.remove();
      return true;
    }
    else
    {
      return false;  
    }
  }
  //Взимане на информацията на профила
  async getProfile(email: string)
  {
    const user: User = await this.findOne({ email });
    delete user.passHash;
    delete user.salt;
    return user;
  }
}