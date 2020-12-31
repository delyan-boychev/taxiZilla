import { EntityRepository, Repository } from "typeorm";
import { RegisterUserDTO } from "./dto/registerUser.dto";
import { UserRoles } from "./enums/userRoles.enum";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { Session, UseGuards } from "@nestjs/common";
import e from "express";


@EntityRepository(User)
export class UserRepository extends Repository<User>
{
  async registerUser(registerUserDto: RegisterUserDTO)
  {
    let user:User = new User();
    const { fName, lName, email, phoneNumber, password } = registerUserDto;
    const dupUser = await User.findOne({email: email});
    let exists = dupUser==undefined;
    if(exists)
    {
      user.email = email;
      user.fName = fName;
      user.lName = lName;
      user.telephone = phoneNumber;
      user.role = UserRoles.USER;
      user.address = "";
      user.verified = false;
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passHash = await bcrypt.hash(password, salt);
      user.passHash = passHash;
      user.salt = salt;
      await user.save();
    }
    return exists;
  }
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
    if (hashed === user.passHash) {
      if (user.verified === true)
      {
        return user; 
      }
      else
      {
        return "notVerified";
      }
    }
    return undefined;
    
  }
  async getAllUsers()
  {
    let users = await this.find();
    users.forEach(el => {
      delete el.passHash;
      delete el.salt;
    });
    return users;
  }
  async removeUser(email:string)
  {
    const user = await this.findOne({email});
    if(user)
    {
      user.remove();
      return true;
    }
    else
    {
      return false;
    }
  }
  async checkPassword(email: string, password: string)
  {
    const user = await this.findOne({ email });
    let hashed = "";
    if (user)
    {
      hashed = await bcrypt.hash(password, user.salt);
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
  async changePassword(email: string, oldPass: string, newPass: string)
  {
    let user = await this.findOne({ email });
    let hashed = await bcrypt.hash(oldPass, user.salt);
    if (hashed === user.passHash)
    {
      let hash2 = await bcrypt.hash(newPass, user.salt);
      user.passHash = hash2;
      await user.save();
      return true;
    }
    else
    {
      return false;
    }
  }
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
  async getProfile(email: string)//Вземане на информация за профила
  {
    const user: User = await this.findOne({ email });
    delete user.passHash;
    delete user.salt;
    return user;
  }
}