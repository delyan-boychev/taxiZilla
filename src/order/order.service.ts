import { Injectable, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { tmpdir } from 'os';
import { UserRoles } from 'src/auth/enums/userRoles.enum';
import { UserStatus } from 'src/auth/enums/userStatus.enum';
import { taxiDriver, taxiDriversFindNearest } from 'src/auth/taxiDriver.class';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { Statuses, Drivers,x,y, Requests } from 'src/coordsAndStatus.array';
import { OrderStatus } from './enums/orderStatus.enum';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
        @InjectRepository(OrderRepository)
        private orderRepository:OrderRepository,
        private jwtService:JwtService,
            
    ){};
    async rejectRequest(@Session() session:{token?:string})
    {
        let uemail = await this.jwtService.decode(session.token);
        let user = await this.userRepository.findOne({email:uemail["email"]});
        if(Requests[user.id])
        {
            if(Requests[user.id]["curdriveridx"]<Requests[user.id]["distances"].length)
            {
                Requests[user.id]["status"]=0;
                if(Requests[user.id]["distances"][Requests[user.id]["curdriveridx"]+1])
                {
                Requests[Requests[user.id]["distances"][Requests[user.id]["curdriveridx"]+1]["index"]]=Requests[user.id];
                }
                else
                {
                    this.orderRepository.createOrder(Requests[user.id]["sender"],user.id,Requests[user.id]["x"],Requests[user.id]["y"], Requests[user.id]["notes"], Requests[user.id]["address"], OrderStatus.Canceled); 
                }
                Requests[user.id]=undefined;
            }
            

        }
    }
    async rejectAfterAccept(@Session() session:{token?: string}, orderID: number, sender:User)
    {
        let uemail = await this.jwtService.decode(session.token);
        let user = await this.userRepository.findOne({email:uemail["email"]});
        const order = await this.orderRepository.deleteOrder(orderID);
        Statuses[user.id]= UserStatus.Busy;
        let a:taxiDriversFindNearest = new taxiDriversFindNearest(order.x,order.y,sender ,order.notes, order.address);
        console.log(order);
        let k = 0;
        for(let i=0; i<Drivers.length; i++)
        {
            if(Drivers[i])
            {

                k++;
            }
        }
        if(k > 0)
        {
        a.getTheNearestDriver();
        }
        else
        {
            this.orderRepository.createOrder(sender, null,order.x,order.y, "", order.address, OrderStatus.Canceled); 
        }
        Statuses[user.id]= UserStatus.Online;

    }
    async createOrder(x:number,y:number, notes:string, @Session() session:{token?:string}, address: string)
    {
        let uemail = await this.jwtService.decode(session.token);
        let sended = await this.userRepository.findOne({email:uemail["email"]});
        let a:taxiDriversFindNearest = new taxiDriversFindNearest(x,y,sended,notes, address);
        let k = 0;
        for(let i=0; i<Drivers.length; i++)
        {
            if(Drivers[i])
            {
                k++;
            }
        }
        if(k > 0)
        {
        a.getTheNearestDriver();
        }
        else
        {
            this.orderRepository.createOrder(sended, null,x,y, "", address, OrderStatus.Canceled); 
        }
    }
    async getOrderOneSender()
    {
        const order = await this.orderRepository.getOrderById(1);
        return order.userOrdered;
    }
    async finishOrder(id:number)
    {
        await this.orderRepository.finishOrder(id);
    }
    async acceptRequest(@Session() session:{token?:string})
    {
        let uemail = await this.jwtService.decode(session.token);
        let user = await this.userRepository.findOne({email:uemail["email"]});
        if(Requests[user.id])
        {
            Requests[user.id]["status"]=1;
            let idOrder = await this.orderRepository.createOrder(Requests[user.id]["sender"],user.id,Requests[user.id]["x"],Requests[user.id]["y"], Requests[user.id]["notes"], Requests[user.id]["address"], OrderStatus.Open); 
            Requests[user.id] = undefined;
            return idOrder;
        }
    }

}
