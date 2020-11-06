import { Injectable, Session, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { JWTPayload } from './jwt-payload';
import { JwtStrategy } from './jwt-strategy';
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
}
