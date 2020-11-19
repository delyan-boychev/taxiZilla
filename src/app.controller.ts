import { Controller, Get, Header, HttpStatus, Next, Param, Req, Res, Session } from '@nestjs/common';
import {Response} from 'express-serve-static-core';
import { AppService } from './app.service';
import { UserRoles } from './auth/enums/userRoles.enum';
import { Resp } from './response.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getMainPage(@Session() session:{token?:string, type?:string, role?:UserRoles}, @Res() res:Response) {
    var isLoggedIn;
    if(session.token === undefined) isLoggedIn = "false";
    else {
      isLoggedIn = "true";
      res.set("Type", session.type);
      if(session.type === "User")res.set("Role", session.role);
    }
    res.set("isLoggedIn", isLoggedIn);
    res.send(this.appService.getMainPage());
  }
  @Get("/logout/")
  logout(@Session() session:{token?:string, type?:string, role?:UserRoles}, @Res() res:Response)
  {
    if(session.token !== undefined) session.token = undefined;
    if(session.type !== undefined) session.type = undefined;
    if(session.role !== undefined) session.role = undefined;
    res.redirect("/");
  }

}
