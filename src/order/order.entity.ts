import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
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

    @ManyToOne(type => User, user => user.orders, {onDelete:'CASCADE'})
    userOrdered:User;

    @Column({default:""})
    items:string;

    @Column({nullable: true})
    driverId:number;

    @Column({nullable:true})
    userId:number;
    
    @Column({default: ""})
    address: string;
    
    @Column({default:""})
    notes:string;

    @Column()
    orderStatus:OrderStatus;

    @Column()
    ip:string;

    @Column()
    date:string;


}