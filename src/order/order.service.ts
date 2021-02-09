import { Injectable, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { tmpdir } from 'os';
import { session } from 'passport';
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
                    this.orderRepository.createOrder(Requests[user.id]["sender"],null,Requests[user.id]["x"],Requests[user.id]["y"], Requests[user.id]["notes"], Requests[user.id]["address"],Requests[user.id]["ip"], OrderStatus.Canceled); 
                }
                Requests[user.id]=undefined;
            }
            

        }
    }
    async rejectAfterAccept(@Session() session:{token?: string}, orderID: number, senderID:number)
    {
        let uemail = await this.jwtService.decode(session.token);
        let user = await this.userRepository.findOne({id: senderID});
        const order = await this.orderRepository.deleteOrder(orderID);
        let a:taxiDriversFindNearest = new taxiDriversFindNearest(order.x,order.y,user ,order.notes, order.address, order.ip);
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
            this.orderRepository.createOrder(user, null,order.x,order.y, "", order.address, order.ip, OrderStatus.Canceled); 
        }

    }
    async createOrder(x:number,y:number, notes:string, @Session() session:{token?:string}, address: string, ip:string)
    {
        let uemail = await this.jwtService.decode(session.token);
        let sended = await this.userRepository.findOne({email:uemail["email"]});
        let a:taxiDriversFindNearest = new taxiDriversFindNearest(x,y,sended,notes, address, ip);
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
            this.orderRepository.createOrder(sended, null,x,y, notes, address, ip,  OrderStatus.Canceled); 
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
            let idOrder = await this.orderRepository.createOrder(Requests[user.id]["sender"],user.id,Requests[user.id]["x"],Requests[user.id]["y"], Requests[user.id]["notes"], Requests[user.id]["address"], Requests[user.id]["ip"], OrderStatus.Open); 
            Requests[user.id] = undefined;
            return idOrder;
        }
    }
    async getOrdersByUser(@Session() session:{token?:string})
    {
        let uemail = await this.jwtService.decode(session.token);
        let user = await this.userRepository.findOne({email:uemail["email"]});
        return await this.orderRepository.getOrderByUser(user);

    }
    async getOrdersByDriver(@Session() session:{token?:string})
    {
        let uemail = await this.jwtService.decode(session.token);
        let user = await this.userRepository.findOne({email:uemail["email"]});
        return await this.orderRepository.getOrdersByDriver(user.id);
    }
    async getAllOrders()
    {
        return this.orderRepository.getAllOrders();
    }
    async removeOrder(orderId:number)
    {
        this.orderRepository.deleteOrder(orderId);
    }
}
