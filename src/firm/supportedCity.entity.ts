import { Firm } from "src/firm/firm.entity";
import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class SupportedCity extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    city:string;

    @Column()
    region:string;

    @ManyToMany(type=>Firm,firm => firm.supportedCities)
    firms:Firm[];
}