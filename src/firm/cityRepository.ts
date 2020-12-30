import { EntityRepository, Repository } from "typeorm";
import { Firm } from "./firm.entity";
import { FirmService } from "./firm.service";
import { SupportedCity } from "./supportedCity.entity";

@EntityRepository(SupportedCity)
export class SupportedCityRepository extends Repository<SupportedCity>
{
    async addCity(city:string,region:string, firm:Firm)
    {
        let qb = this.createQueryBuilder("supportedCity");
        qb.andWhere("supportedCity.city = :cit",{cit:city});
        qb.andWhere("supportedCity.region = :reg",{reg:region});
        qb.leftJoinAndSelect("supportedCity.firms","firm")
        let record = await qb.getOne();
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
            newRec.firms=[firm];
            await newRec.save();
            console.log(newRec.firms);
            firm.supportedCities.push(newRec);
            await firm.save();
            return true;
        }
    }
    async removeCity(city:string, region:string, firm:Firm)
    {
        let qb = this.createQueryBuilder("supportedCity");
        qb.andWhere("supportedCity.city = :cit",{cit:city});
        qb.andWhere("supportedCity.region = :reg",{reg:region});
        qb.leftJoinAndSelect("supportedCity.firms","firm");
        let record = await qb.getOne();
        console.log(record);
        if(record)
        {
            console.log(record.city);
            console.log(record.firms);
            console.log(record.region);
            console.log(firm);
            record.firms.forEach(async function(item,index,object){
                if(item.id === firm.id)
                {
                    console.log(true);
                    record.firms = record.firms.splice(index,1);
                    firm.supportedCities = firm.supportedCities.splice(firm.supportedCities.indexOf(record),1);
                    await record.save();
                    await firm.save();
                    return true;
                }
                else
                {
                    return false;
                }
            });
        }
        else
        {
            return false;
        }
    }
    async getCitiesByFirm(firm:Firm)
    {
        return firm.supportedCities;
    }
    async getAllCities()
    {
        return await this.find();
    }
}