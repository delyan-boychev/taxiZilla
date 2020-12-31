import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import {User} from "../auth/user.entity"
import { OrderStatus } from "./enums/orderStatus.enum";

@Entity()
export class taxiOrder extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id:Number;

    @Column({ type: "float", precision: 10, scale: 6 })
    x:number;

    @Column({ type: "float", precision: 10, scale: 6 } )
    y:number;

    @ManyToOne(type => User, user => user.orders)
    userOrdered:User;

    @Column()
    items:string;

    @Column({nullable: true})
    driverId:number;
    
    @Column({default: ""})
    address: string;
    
    @Column({default:""})
    notes:string;

    @Column()
    orderStatus:OrderStatus;


}