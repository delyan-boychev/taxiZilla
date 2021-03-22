import { User } from "src/auth/user.entity";
import { Drivers } from "src/coordsAndStatus.array";
import { EntityRepository, Repository } from "typeorm";
import { OrderStatus } from "./enums/orderStatus.enum";
import { taxiOrder } from "./order.entity";

@EntityRepository(taxiOrder)
export class OrderRepository extends Repository<taxiOrder>
{
    async createOrder(sender:User,driverId:number,x:number,y:number, notes:string, address:string, items:string, ip:string, statusOrder:OrderStatus)
    {
        let newOrder = new taxiOrder();
        newOrder.x=x;
        newOrder.y=y;
        newOrder.address = address;
        newOrder.notes = notes;
        newOrder.orderStatus=statusOrder;
        newOrder.userOrdered=sender;
        newOrder.userId = sender.id;
        newOrder.driverId=driverId;
        if(!items)
        {
            items = "";
        }
        newOrder.items = items;
        newOrder.ip = ip;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        const strd =  ("0" + dd).slice(-2) + '-' +  ("0" + mm).slice(-2) + '-' + yyyy + " " +  ("0" + h).slice(-2) + ":" +  ("0" + m).slice(-2) + ":" +  ("0" + s).slice(-2);
        newOrder.date = strd;
        await newOrder.save();
        await sender.save();
        return newOrder.id;
    }
    async finishOrder(id:number)
    {
        const order = await this.findOne({id:id});
        order.orderStatus = OrderStatus.Closed;
        order.save();
    }
    async getOrderById(id:number)
    {
        const order = await this.findOne({id});
        return order;
    }
    async trackDriverByOrder(order:taxiOrder)
    {
        if(order.orderStatus == OrderStatus.Open)
        {
            if(Drivers[order.driverId])
            {
                return Drivers[order.driverId].y + ", " + Drivers[order.driverId].x;
            }
            else
            {
                return "";
            }
        }
        else
        {
            return false;
        }
    }
    async deleteOrder(orderID:number)
    {
        const order = await this.findOne({id: orderID});
        const tmp = order;
        await order.remove();
        return tmp;
    }
    async getOrderByUser(user:User)
    {
        let orders = await this.find({userId: user.id});
        return orders;
    }
    async getOrdersByDriver(driverId:number)
    {
        let orders = await this.find({driverId: driverId});
        return orders;
    }
    async getAllOrders()
    {
        let orders = await this.find();
        return orders;
    }
}