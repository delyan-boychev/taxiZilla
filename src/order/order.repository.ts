import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { OrderStatus } from "./enums/orderStatus.enum";
import { taxiOrder } from "./order.entity";

@EntityRepository(taxiOrder)
export class OrderRepository extends Repository<taxiOrder>
{
    async createOrder(sender:User,driverId:number,x:number,y:number, notes:string, address:string, statusOrder:OrderStatus)
    {
        let newOrder = new taxiOrder();
        newOrder.x=x;
        newOrder.y=y;
        newOrder.address = address;
        newOrder.notes = notes;
        newOrder.orderStatus=statusOrder;
        newOrder.userOrdered=sender;
        newOrder.driverId=driverId;
        newOrder.items = "";
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
    async getOrderByUser(user:User)
    {
        let qb = this.createQueryBuilder("order");
        qb.andWhere("order.driverId = :userid",{userid:user.id});
        qb.andWhere("order.orderStatus = :orderStatus",{orderStatus:OrderStatus.Open});
        return await qb.getMany();
    }
}