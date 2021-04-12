import { BadRequestException, Body, Controller, Get, Post, Request, Session, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { session } from 'passport';
import { parse } from 'path';
import { UserRoles } from 'src/auth/enums/userRoles.enum';
import { User } from 'src/auth/user.entity';
import { CreateOrderDTO } from './dto/createOrderDto.dto';
import { taxiOrder } from './order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(
        private orderService:OrderService,

    ){
        setInterval(this.orderService.intervalCode.bind(null, this.orderService),20000);
    };
    @Post('/rejectOrderAfterAccept')
    async rejectOrderAfterAccept(@Session() session: {token?: string, role?:string}, @Body("orderID") orderID:string, @Body("senderID") senderID:string)
    {
        if(!session||!orderID||!senderID)throw new BadRequestException();
        if(!session.token || session.role != UserRoles.DRIVER) throw new UnauthorizedException();
        this.orderService.rejectAfterAccept(session, parseInt(orderID), parseInt(senderID));
    }
    @Get('/getOrderMessage')
    async getOrderMessage(@Session() session: {token?:string, role?:string, type?:string})
    {
        if(!session.token || session.type == "Firm" || session.role == UserRoles.DRIVER) throw new UnauthorizedException();
        return await this.orderService.getOrderMessage(session);
    }
    @Post('/createOrder')
    createOrder(@Body(ValidationPipe) createOrderDTO:CreateOrderDTO, @Session() session:{token?:string, type?:string, role?:string}, @Request() req:Request)
    {
        const {x,y,offset,address,key,notes,items} = createOrderDTO;
        if(!session.token || session.type == "Firm" || session.role == UserRoles.DRIVER)throw new UnauthorizedException();
        const ip = req.headers["cf-connecting-ip"];
        if(!key) throw new UnauthorizedException();
        if(key.length!=19) throw new UnauthorizedException();
        const date = new Date();
        const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()+3, date.getUTCMilliseconds() ));
        const str = this.orderService.decode(key);
        const d2 = new Date(Date.UTC(parseInt(str.substr(0, 4)), parseInt(str.substr(6, 2))-1, parseInt(str.substr(4, 2)), parseInt(str.substr(8, 2)), parseInt(str.substr(10, 2)), parseInt(str.substr(12, 2)) + 1, 0 + parseInt(offset)));
        const d3 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()-3, date.getUTCMilliseconds()));
        if(isNaN(d2.getTime())) throw new UnauthorizedException();
        if(d2.getTime()>d.getTime() || d3.getTime()>d2.getTime()) throw new UnauthorizedException();
        return this.orderService.createOrder(parseFloat(x),parseFloat(y),notes, session, address, items, ip);
    }
    @Post('/trackDriverByOrder')
    async trackDriverByOrder(@Session() session:{token?:string, role?:string, type?:string}, @Body("orderID") id:string)
    {
        if(!id)throw new BadRequestException();
        if(!session.token || session.type == "Firm" || session.role == UserRoles.DRIVER)throw new UnauthorizedException();
        return await this.orderService.trackDriverByOrder(parseInt(id));
    }
    @Post("/acceptOrder/")
    async acceptOrder(@Session() session:{token?:string, role?:string})
    {
        if(!session.token || session.role != UserRoles.DRIVER)throw new UnauthorizedException();
        return this.orderService.acceptRequest(session);
    }
    @Post("/rateOrder/")
    async rateOrder(@Session() session:{token?:string, role?:string, type?:string}, @Body("rating") rating:string, @Body("ratingComment") ratingComment:string,  @Body("orderID") orderID:string)
    {
        if(!rating) throw new BadRequestException();
        if(!orderID) throw new BadRequestException();
        if(!session.token || session.type == "Firm" || session.role == UserRoles.DRIVER)throw new UnauthorizedException();
        return this.orderService.rateOrder(session, parseInt(rating), parseInt(orderID), ratingComment);
    }
    @Post("/rejectOrder/")
    async rejectOrder(@Session() session:{token?:string, role?:string})
    {
        if(!session.token || session.role != UserRoles.DRIVER)throw new UnauthorizedException();
        return this.orderService.rejectRequest(session);
    }
    @Post("/finishOrder/")
    async finishOrder(@Session() session:{token?:string, role?:string}, @Body('id') id:string)
    {
        if(!id)throw new BadRequestException();
        if(!session.token || session.role != UserRoles.DRIVER) throw new UnauthorizedException();
        this.orderService.finishOrder(Number(id));
    }
    @Get("/getAllOrders")
    async getAllOrders(@Session() session:{token?:string, role?:string})
    {
        if(!session.token || (session.role!=UserRoles.ADMIN&&session.role!=UserRoles.MODERATOR)) throw new UnauthorizedException();
        return await this.orderService.getAllOrders(session);
    }
    @Get("/getOrdersByUser")
    async getOrdersByUser(@Session() session:{token?:string})
    {
        if(!session.token) throw new UnauthorizedException();
        return await this.orderService.getOrdersByUser(session);
    }
    @Get("/getOrdersByDriver")
    async getOrdersByDriver(@Session() session:{token?:string, role?:string})
    {
        if(!session.token || session.role != UserRoles.DRIVER) throw new UnauthorizedException();
        return await this.orderService.getOrdersByDriver(session);
    }
    @Post("/removeOrder")
    async removeOrder(@Session() session:{token?:string, role?:string}, @Body("orderId") orderId:string)
    {
        if(!orderId)throw new BadRequestException();
        if(!session.token ||session.role != UserRoles.ADMIN)throw new UnauthorizedException();
        return await this.orderService.removeOrder(parseInt(orderId));
    }

}

