import { Body, Controller, Get, Post, Session, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { taxiOrder } from './order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(
        private orderService:OrderService,

    ){};
    @Get("/getOrderOneSender")
    async getOrderOneSender()
    {
        return await this.orderService.getOrderOneSender();
    }
    @Post('/createOrder')
    createOrder(@Body('x') x:number,@Body('y') y:number, @Body('notes') notes:string, @Body('address') address:string, @Session() session:{token?:string}, )
    {
        if(!session.token)throw new UnauthorizedException();
        return this.orderService.createOrder(x,y,notes, session, address);
        
    }
    @Post("/acceptOrder/")
    async acceptOrder(@Session() session:{token?:string})
    {
        if(!session.token)throw new UnauthorizedException();
        return this.orderService.acceptRequest(session);
    }
    @Post("/rejectOrder/")
    async rejectOrder(@Session() session:{token?:string})
    {
        if(!session.token)throw new UnauthorizedException();
        return this.orderService.rejectRequest(session);
    }
    @Post("/finishOrder/")
    async finishOrder(@Session() session:{token?:string}, @Body('id') id:string)
    {
        if(!session.token) throw new UnauthorizedException();
        this.orderService.finishOrder(Number(id));
    }

}

