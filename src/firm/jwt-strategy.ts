import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { FirmRepository } from "./firm.repository";
import { JWTPayloadFirm } from "./jwt-payload";


@Injectable()
export class JwtStrategyFirm extends PassportStrategy(Strategy)
{
  constructor(
    @InjectRepository(FirmRepository)
    private firmRepository:FirmRepository,
  ) { 
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'UJ=AMG59_%PaT#NqzQ7ZKr%U^QbH*S=CPmNzwrMQtmpXexAr@zmu?5vvKysTxCsa',
    })
  };
  async validate(payload:JWTPayloadFirm)
  {
    const { eik } = payload;
    const firm = await this.firmRepository.findOne({ eik });
    if (!firm)
    {
      throw new UnauthorizedException();  
    }
    return firm;
  }
}