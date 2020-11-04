import { Controller, Get, Param } from '@nestjs/common';
import { fstat } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMainPage(): string {
    return this.appService.getMainPage();
  }

}
