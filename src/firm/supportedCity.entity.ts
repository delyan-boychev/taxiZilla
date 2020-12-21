import { Firm } from "src/firm/firm.entity";
import { BaseEntity, Column, Entity, ManyToMany } from "typeorm";

@Entity()

export class SupportedCity extends BaseEntity
{
    @Column()
    city:string;

    @Column()
    region:string;

    @ManyToMany(type=>Firm,firm => firm.supportedCities)
    firms:Firm[];
}