import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWTPayload } from "./jwt-payload";
import { UserRepository } from "./user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
  //Dependency injection 
  constructor(
    @InjectRepository(UserRepository)
    private userRepository:UserRepository,
  ) { 
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'UJ=AMG59_%PaT#NqzQ7ZKr%U^QbH*S=CPmNzwrMQtmpXexAr@zmu?5vvKysTxCsa',
    })
  };
  //Валидиране на JWT токена (Както виждаме класа extend-ва PassportStrategy. Затова се изисква метод verify)
  async validate(payload:JWTPayload)
  {
    const { email } = payload;
    const user = await this.userRepository.findOne({ email });
    if (!user)
    {
      throw new UnauthorizedException();  
    }
    return user;
  }
}