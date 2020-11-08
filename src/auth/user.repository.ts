import { EntityRepository, Repository } from "typeorm";
import { RegisterUserDTO } from "./dto/registerUser.dto";
import { UserRoles } from "./enums/userRoles.enum";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';


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
      return email; 
    }
    return undefined;
    
  }
  async getProfile(email: string)
  {
    const user: User = await this.findOne({ email });
    return user;
  }
}