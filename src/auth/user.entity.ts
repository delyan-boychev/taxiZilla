import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "./enums/userRoles.enum";
import { Firm } from "../firm/firm.entity";
import { Order } from "src/order/order.entity";

@Entity()
export class User extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fName: string;

  @Column()
  lName: string;

  @Column()
  email: string;

  @Column()
  passHash: string;

  @Column()
  telephone: string;

  @Column()
  role: UserRoles;

  @Column()
  salt: string;

  @Column()
  address:string;

  @Column()
  verified: boolean;

  @OneToMany(type => Order, order => order.userOrdered)
  orders:Order[];

  @ManyToOne(type => Firm, firm => firm.drivers)
  firm: Firm;

}