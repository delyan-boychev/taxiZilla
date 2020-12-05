import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { OrderStatus } from "./enums/orderStatus.enum";
import { Order } from "./order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order>
{
    async createOrder(sender:User,driver:User,x:number,y:number, notes:string)
    {
        let newOrder = new Order();
        newOrder.x=x;
        newOrder.y=y;
        newOrder.notes = notes;
        newOrder.orderStatus=OrderStatus.Open;
        newOrder.userOrdered=sender;
        newOrder.driverId=driver.id;
        sender.orders.push(newOrder);
        await newOrder.save();
        await sender.save();
        return newOrder;
    }
}