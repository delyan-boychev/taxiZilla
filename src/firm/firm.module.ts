import { HttpModule, Module } from '@nestjs/common';
import { FirmService } from './firm.service';
import { FirmController } from './firm.controller';
import { JwtStrategyFirm } from './jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { FirmRepository } from './firm.repository';
import { UserRepository } from 'src/auth/user.repository';
import { SupportedCityRepository } from './cityRepository';

@Module({
  imports: [
    PassportModule.register({defaultStrategy:'jwt'}),
    TypeOrmModule.forFeature([UserRepository,FirmRepository,SupportedCityRepository]),
    JwtModule.register({
      secret: 'UJ=AMG59_%PaT#NqzQ7ZKr%U^QbH*S=CPmNzwrMQtmpXexAr@zmu?5vvKysTxCsa',
      signOptions: {
        expiresIn:1800,
      }
    })
  ],
  exports: [JwtStrategyFirm, PassportModule, FirmService],
  providers: [FirmService,JwtStrategyFirm],
  controllers: [FirmController]
})
export class FirmModule {}
