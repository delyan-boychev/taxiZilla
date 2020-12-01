import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from 'src/auth/user.repository';
import { FirmRepository } from 'src/firm/firm.repository';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    PassportModule.register({defaultStrategy:'jwt'}),
    TypeOrmModule.forFeature([UserRepository,FirmRepository,OrderRepository]),
    JwtModule.register({
      secret: 'UJ=AMG59_%PaT#NqzQ7ZKr%U^QbH*S=CPmNzwrMQtmpXexAr@zmu?5vvKysTxCsa',
      signOptions: {
        expiresIn:1800,
      }
    })
  ],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
