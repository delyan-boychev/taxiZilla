import { Injectable, Session, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { tmpdir } from 'os';
import { session } from 'passport';
import { UserRoles } from 'src/auth/enums/userRoles.enum';
import { UserStatus } from 'src/auth/enums/userStatus.enum';
import { orderMessage, taxiDriver, taxiDriversFindNearest } from 'src/auth/taxiDriver.class';
import { RequestsTimestamps } from 'src/auth/timestamps.exports';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { Drivers,x,y, Requests, DriversForTracking, orderMessages } from 'src/coordsAndStatus.array';
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
    async intervalCode(instance:any)
    {
        
        let timeStamp = new Date();
        for(let i = 0; i < RequestsTimestamps.length; i++)
        {
            if(RequestsTimestamps[i] && (timeStamp.getTime()-RequestsTimestamps[i].getTime()>30000))
            {
                Drivers[i] = undefined;
                DriversForTracking[i] = undefined;
                await instance.rejectRequestById(i);
            }
        }
    }
    async rateOrder(@Session() session:{token?:string, role?:string, type?:string}, rating:number, orderID:number, ratingComment:string)
    {
        let uemail = await this.jwtService.decode(session.token);
        let user = await this.userRepository.findOne({email:uemail["email"]});
        return this.orderRepository.rateOrder(user, rating, ratingComment, orderID);
    }
    async rejectRequestById(id:number)
    {
        let user = await this.userRepository.findOne({id});
        if(Requests[user.id])
        {
            if(Requests[user.id]["curdriveridx"]<Requests[user.id]["distances"].length)
            {
                Requests[user.id]["status"]=0;
                if(Requests[user.id]["distances"][Requests[user.id]["curdriveridx"]+1])
                {
                    Requests[Requests[user.id]["distances"][Requests[user.id]["curdriveridx"]+1]["index"]]=Requests[user.id];
                    RequestsTimestamps[Requests[user.id]["distances"][Requests[user.id]["curdriveridx"]+1]["index"]]=RequestsTimestamps[user.id];
                }
                else
                {
                    orderMessages[Requests[user.id]["sender"].id].isAccepted = true;
                    orderMessages[Requests[user.id]["sender"].id].driverName = "";
                    this.orderRepository.createOrder(Requests[user.id]["sender"],null,Requests[user.id]["x"],Requests[user.id]["y"], Requests[user.id]["notes"], Requests[user.id]["address"],Requests[user.id]["items"], Requests[user.id]["ip"], OrderStatus.Canceled); 
                }
                Requests[user.id]=undefined;
                RequestsTimestamps[user.id]=undefined;
            }
            

        }
    }
    async trackDriverByOrder(orderID:number)
    {
        const order = await this.orderRepository.findOne({id: orderID});
        return await this.orderRepository.trackDriverByOrder(order);
    }
    async getOrderMessage(@Session() session:{token?:string})
    {
        let uemail = await this.jwtService.decode(session.token);
        let user = await this.userRepository.findOne({email:uemail["email"]});
        if(orderMessages[user.id])
        {
            var message = orderMessages[user.id];
            if(orderMessages[user.id].isAccepted == true) orderMessages[user.id] = undefined;
            return message;
        }
        else
        {
            return "";
        }

    }
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
                    RequestsTimestamps[Requests[user.id]["distances"][Requests[user.id]["curdriveridx"]+1]["index"]]=RequestsTimestamps[user.id];
                }
                else
                {
                    orderMessages[Requests[user.id]["sender"].id].isAccepted = true;
                    orderMessages[Requests[user.id]["sender"].id].driverName = "";
                    this.orderRepository.createOrder(Requests[user.id]["sender"],null,Requests[user.id]["x"],Requests[user.id]["y"], Requests[user.id]["notes"], Requests[user.id]["address"],Requests[user.id]["items"],Requests[user.id]["ip"], OrderStatus.Canceled); 
                }
                Requests[user.id]=undefined;
                RequestsTimestamps[user.id]=undefined;
            }
            

        }
    }
    async rejectAfterAccept(@Session() session:{token?: string}, orderID: number, senderID:number)
    {
        let uemail = await this.jwtService.decode(session.token);
        let user = await this.userRepository.findOne({id: senderID});
        const order = await this.orderRepository.deleteOrder(orderID);
        let a:taxiDriversFindNearest = new taxiDriversFindNearest(order.x,order.y,user ,order.notes, order.address, order.ip, order.items, user.telephone);
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
            this.orderRepository.createOrder(user, null,order.x,order.y, "", order.address, order.items, order.ip, OrderStatus.Canceled); 
        }

    }
    //Функция която декодира ключа
    decode(data)
    {
        let result="";
        for(let i=6;i<data.length-6;i++)
        {
            let tmp = data.charCodeAt(i);
            tmp-=33;
            result+=("0" + tmp.toString()).slice(-2);
        }
        return result;
    }
    async createOrder(x:number,y:number, notes:string, @Session() session:{token?:string}, address: string, items:string, ip:string)
    {
        let uemail = await this.jwtService.decode(session.token);
        let sended = await this.userRepository.findOne({email:uemail["email"]});
        let a:taxiDriversFindNearest = new taxiDriversFindNearest(x,y,sended,notes, address, ip, items, sended.telephone);
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
            orderMessages[sended.id] = new orderMessage(false, "");
            a.getTheNearestDriver();
        }
        else
        {
            orderMessages[sended.id] = new orderMessage(true, "");
            this.orderRepository.createOrder(sended, null,x,y, notes, address, items, ip, OrderStatus.Canceled); 
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
            let idOrder = await this.orderRepository.createOrder(Requests[user.id]["sender"],user.id,Requests[user.id]["x"],Requests[user.id]["y"], Requests[user.id]["notes"], Requests[user.id]["address"],Requests[user.id]["items"], Requests[user.id]["ip"], OrderStatus.Open); 
            orderMessages[Requests[user.id]["sender"].id].driverName = user.fName + " " + user.lName;
            orderMessages[Requests[user.id]["sender"].id].isAccepted = true;
            Requests[user.id] = undefined;
            RequestsTimestamps[user.id] = undefined;
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
    async getAllOrders(@Session() session:{token?:string})
    {
        return this.orderRepository.getAllOrders();
    }
    async removeOrder(orderId:number)
    {
        this.orderRepository.deleteOrder(orderId);
    }
}
