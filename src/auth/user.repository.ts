import { EntityRepository, Repository } from "typeorm";
import { RegisterUserDTO } from "./dto/registerUser.dto";
import { UserRoles } from "./enums/userRoles.enum";
import { User } from "./user.entity";


@EntityRepository(User)
export class UserRepository extends Repository<User>
{
  async registerUser(registerUserDto: RegisterUserDTO)
  {
    let user:User = new User();
    const { fName, lName, email, phoneNumber, password } = registerUserDto;
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
    return user;
  }
}