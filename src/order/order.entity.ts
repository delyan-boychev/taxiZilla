import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import {User} from "../auth/user.entity"
import { OrderStatus } from "./enums/orderStatus.enum";

@Entity()
export class Order extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id:Number;

    @Column()
    x:Number;

    @Column()
    y:Number;

    @ManyToOne(type => User, user => user.orders)
    userOrdered:User;

    @Column()
    items:string;

    @Column()
    driverId:number;

    @Column()
    orderStatus:OrderStatus;


}