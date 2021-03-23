import { Controller, Get, Header, HttpException, HttpStatus, Next, Param, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {Response} from 'express-serve-static-core';
import { get } from 'http';
import { AppService } from './app.service';
import { UserRoles } from './auth/enums/userRoles.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getMainPage(@Session() session:{token?:string, type?:string, role?:UserRoles}, @Res() res:Response) {
    var resp = {};
    var isLoggedIn;
    if(session.token === undefined) resp["isLoggedIn"] = "false";
    else {
      resp["isLoggedIn"] = "true";
      resp["Type"] = session.type;
      if(session.type === "User")resp["Role"] = session.role;
    }
    let homePage:string = this.appService.getMainPage().replace("</body>", "<p id=\"res\"style=\"display:none;\">" + JSON.stringify(resp) +" </p>").replace("</html>", "");
    res.send(homePage + "</body></html>");
  }
  @Get("/privacypolicy")
  privacypolicy()
  {
    return this.appService.getPrivacyPolicy();
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
