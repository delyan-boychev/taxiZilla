import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host:'localhost',
      username: 'taxiZilla',
      password: 'VhCNrHnMEB3sE?9_',
      database: 'taxiZilla',
      entities:[],
      synchronize:true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
