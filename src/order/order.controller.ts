import { Body, Controller, Post, Session } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(
        private orderService:OrderService,

    ){};
    @Post('createOrder')
    createOrder(@Body('x') x:number,@Body('y') y:number, @Session() session:{token?:string})
    {
        this.orderService.createOrder(x,y,session);
        
    }

}

