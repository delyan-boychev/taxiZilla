import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { UserRoles } from "./enums/userRoles.enum";
import { Firm } from "../firm/firm.entity";
import { taxiOrder } from "src/order/order.entity";
import { SavedAddress } from "./savedAddress.entity";

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
  verified: boolean;

  @OneToMany(type => taxiOrder, order => order.userOrdered, { cascade:true, onDelete:'CASCADE', eager:true})
  orders:taxiOrder[];

  @Column()
  licensePlate:string;

  @RelationId((user: User) => user.firm)
  firmId: number;

  @ManyToOne(type => Firm, firm => firm.drivers)
  firm: Firm;

  @Column()
  lastChangePassword:string;

  @OneToMany(type => SavedAddress, city => city.user)
  savedAddresses:SavedAddress[];
}