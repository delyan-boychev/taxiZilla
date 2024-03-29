import { UnauthorizedException } from "@nestjs/common";
import { EntityRepository, getManager, Repository, Unique } from "typeorm";
import { Firm } from "./firm.entity";
import { FirmService } from "./firm.service";
import { SupportedCity } from "./supportedCity.entity";

@EntityRepository(SupportedCity)
export class SupportedCityRepository extends Repository<SupportedCity>
{
    //Добавяне на поддържан град от фирма
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
                firm.supportedCities.push(record);
                await record.save();
                await firm.save();
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
            firm.supportedCities.push(newRec);
            await firm.save();
            return true;
        }
    }
    async removeCity(city:string, region:string, firm:Firm)
    {
        let qb = this.createQueryBuilder("supportedCity");
        qb.leftJoinAndSelect("supportedCity.firms","firm");
        qb.andWhere("supportedCity.city = :cit", {cit:city});
        qb.andWhere("supportedCity.region = :reg",{reg:region});
        let record = await qb.getOne();
        await this.query("DELETE FROM supported_city_firms_firm WHERE supportedCityId="+record.id+" AND firmId="+firm.id+";");
        record = await qb.getOne();
        if(record.firms.length==0)
        {
            await record.remove();
        }
        return true;

    }
    async removeCityById(cityId:number, firm:Firm)
    {
        let qb = this.createQueryBuilder("supportedCity");
        qb.leftJoinAndSelect("supportedCity.firms","firm");
        qb.andWhere("supportedCity.id = :id", {id:cityId});
        let record = await qb.getOne();
        await this.query("DELETE FROM supported_city_firms_firm WHERE supportedCityId="+record.id+" AND firmId="+firm.id+";");
        record = await qb.getOne();
        if(record.firms.length==0)
        {
            await record.remove();
        }
        return true;

    }
    async getCitiesByFirm(firm:Firm)
    {
        if(!firm) throw new UnauthorizedException();
        return firm.supportedCities;
    }
    async getAllCities()
    {
        return await this.find();
    }
    async getAllCitiesInBG()
    {
        const entityManager = getManager();
        return await entityManager.query("SELECT * FROM city;");
    }
    async getCitiesInBGByRegion(region:string)
    {
        const entityManager = getManager();
        return await entityManager.query('SELECT * FROM city WHERE municipality LIKE "%'+ region +'%"'); 
    }
}