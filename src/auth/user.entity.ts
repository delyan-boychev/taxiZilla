import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { UserRoles } from "./enums/userRoles.enum";
import { Firm } from "../firm/firm.entity";
import { taxiOrder } from "src/order/order.entity";

//Модел на таблицата user в базата данни
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

  @OneToMany(type => taxiOrder, order => order.userOrdered, { cascade: true, onDelete:'CASCADE'})
  orders:taxiOrder[];
  @RelationId((user: User) => user.firm)
  firmId: number;

  @ManyToOne(type => Firm, firm => firm.drivers)
  firm: Firm;

}