import { HttpModule, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirmRepository } from '../firm/firm.repository';
import { JwtStrategy } from './jwt-strategy';
import { UserRepository } from './user.repository';
import { FirmModule } from 'src/firm/firm.module';
import { SupportedCityRepository } from 'src/firm/cityRepository';
import { ModOperationRepository } from './modOperation.repository';
import { OrderRepository } from 'src/order/order.repository';
import { SavedAddressRepository } from './savedAddress.repository';

@Module({
  imports: [
    FirmModule,
    PassportModule.register({defaultStrategy:'jwt'}),
    TypeOrmModule.forFeature([UserRepository, FirmRepository, OrderRepository, SupportedCityRepository,ModOperationRepository,SavedAddressRepository]),
    JwtModule.register({
      secret: 'UJ=AMG59_%PaT#NqzQ7ZKr%U^QbH*S=CPmNzwrMQtmpXexAr@zmu?5vvKysTxCsa',
      signOptions: {
        expiresIn:1800,
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
