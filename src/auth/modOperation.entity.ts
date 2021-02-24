import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ModeratorOperation extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    moderatorEmail:string;

    @Column()
    action:string;

    @Column()
    date:string;
}