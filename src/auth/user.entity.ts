import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "./enums/userRoles.enum";

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
}