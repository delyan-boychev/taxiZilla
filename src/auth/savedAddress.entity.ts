import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class SavedAddress extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id:number;
    
    @ManyToOne(type => User, user => user.savedAddresses)
    @JoinColumn()
    user:User;

    @Column()
    city:string;

    @Column()
    address:string;
}