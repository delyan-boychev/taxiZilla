import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity() 
export class Firm extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eik: string;
  
  @Column()
  firmName: string;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  passHash: string;

  @Column()
  salt: string;
  
  @OneToMany(type => User, user => user.firm, { eager: true })
  drivers: User[];
}