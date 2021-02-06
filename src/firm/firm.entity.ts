import { SupportedCity } from "src/firm/supportedCity.entity";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { User } from "../auth/user.entity";

@Entity() 
export class Firm extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eik: string;

  @Column()
  email:string;
  
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

  @Column()
  verified: boolean;

  @Column()
  moderationVerified:boolean;
  
  @OneToMany(type => User, user => user.firm, { eager: true })
  drivers: User[];

  @ManyToMany(type => SupportedCity, supportedcity=>supportedcity.firms, {cascade:true, eager: true})
  supportedCities:SupportedCity[];

  @Column()
  lastChangePassword:string;
  
}