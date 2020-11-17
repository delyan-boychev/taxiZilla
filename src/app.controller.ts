import { Controller, Get, Header, HttpStatus, Next, Param, Req, Res, Session } from '@nestjs/common';
import {Response} from 'express-serve-static-core';
import { AppService } from './app.service';
import { Resp } from './response.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getMainPage(@Session() session:{token?:String, isUsingBrowser?:Boolean}, @Res() res:Response) {
    var isLoggedIn;
    if(!session.token) isLoggedIn = "false";
    else isLoggedIn = "true";
    session.isUsingBrowser = true;
    res.set("isLoggedIn", isLoggedIn);
    res.send(this.appService.getMainPage());
  }
  @Get("/logout/")
  logout(@Session() session:{token?:String}, @Res() res:Response)
  {
    if(session.token) session.token = "";
    res.redirect("/");
  }

}
