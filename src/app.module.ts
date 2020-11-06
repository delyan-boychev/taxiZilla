import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host:'localhost',
      username: 'taxiZilla',
      password: 'VhCNrHnMEB3sE?9_',
      database: 'taxiZilla',
      entities:[User],
      synchronize:true,
    })
    
    ,
    SessionModule.forRoot({
      session: { secret: '33P7Ma@S85u6?K6mRCM2wXzXQdwGFsSs?Geqy!gqYPt@m8EG5e=mVZhPGMJ_jw+j',
      name: "taxiZilla",
      proxy: true,
      resave: true,
      saveUninitialized: true },

    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
