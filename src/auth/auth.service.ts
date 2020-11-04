import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
  ) { };
  async registerUser(registerUserDto: RegisterUserDTO)
  {
    return await this.userRepository.registerUser(registerUserDto);

  }
}
