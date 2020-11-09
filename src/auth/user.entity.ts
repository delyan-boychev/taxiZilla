import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "./enums/userRoles.enum";
import { Firm } from "./firm.entity";

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

  @ManyToOne(type => Firm, firm => firm.drivers)
  firm: Firm;
}