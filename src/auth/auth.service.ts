import { Injectable, Session, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { toNamespacedPath } from 'path';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { JWTPayload } from './jwt-payload';
import { JwtStrategy } from './jwt-strategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

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
    const payload: JWTPayload = { email };
    const JWTToken = this.jwtService.sign(payload);
    session.token = JWTToken;
    return true;
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
}
