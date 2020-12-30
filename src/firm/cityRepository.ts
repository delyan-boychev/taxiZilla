import { EntityRepository, Repository } from "typeorm";
import { Firm } from "./firm.entity";
import { FirmService } from "./firm.service";
import { SupportedCity } from "./supportedCity.entity";

@EntityRepository(SupportedCity)
export class SupportedCityRepository extends Repository<SupportedCity>
{
    async addCity(city:string,region:string, firm:Firm)
    {
        let record = await this.findOne({city});
        if(record)
        {
            if(record.firms.includes(firm))
            {
                return false;
            }
            else
            {
                record.firms.push(firm);
                return true;
            }
        }
        else
        {
            let newRec = new SupportedCity();
            newRec.city=city;
            newRec.region=region;
            newRec.firms.push(firm);
            await newRec.save();
            return true;
        }
    }
    async removeCity(city:string, region:string, firm:Firm)
    {
        let qb = this.createQueryBuilder("supportedCity");
        qb.andWhere("supportedCity.city = :cit",{cit:city});
        qb.andWhere("supportedCity.region = :reg",{reg:region});
        let record = await qb.getOne();
        if(record)
        {
            if(record.firms.includes(firm))
            {
                record.firms = record.firms.splice(record.firms.indexOf(firm),1);
                firm.supportedCities = firm.supportedCities.splice(firm.supportedCities.indexOf(record),1);
                await record.save();
                await firm.save();
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    async getSupportedCities(firm:Firm)
    {  
        return firm.supportedCities;
    }
}