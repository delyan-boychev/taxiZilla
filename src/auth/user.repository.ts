import { EntityRepository, Repository } from "typeorm";
import { RegisterUserDTO } from "./dto/registerUser.dto";
import { UserRoles } from "./enums/userRoles.enum";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { UseGuards } from "@nestjs/common";
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
      return "User is already verified";  
    }
    else
    {
      user.verified = true;
      await user.save();
      return "Verified";
    }
  }
  async loginUser(email: string, password: string)
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
        return email; 
      }
      else
      {
        return "notVerified";
      }
    }
    return undefined;
    
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
    let hashed = bcrypt.hash(oldPass, user.salt);
    if (hashed === user.passHash)
    {
      let hash2 = bcrypt.hash(newPass, user.salt);
      user.passHash = hash2;
      await user.save();
      return "Changed password";
    }
    else
    {
      return "Incorrect old password";
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
  async getProfile(email: string)
  {
    const user: User = await this.findOne({ email });
    delete user.passHash;
    delete user.salt;
    return user;
  }
}