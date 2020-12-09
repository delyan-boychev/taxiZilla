import { EntityRepository, Repository } from "typeorm";
import { RegisterFirmDTO } from "./dto/registerFirm.dto";
import { Firm } from "./firm.entity";
import * as bcrypt from 'bcrypt';
import e from "express";
import { User } from "src/auth/user.entity";
import { UserRoles } from "src/auth/enums/userRoles.enum";

@EntityRepository(Firm)
export class FirmRepository extends Repository<Firm>
{
  async registerFirm(registerFirmDto:RegisterFirmDTO)
  {
    const {eik,email,phoneNumber,password,address,city,firmName}=registerFirmDto;
    const eikCheck = await this.findOne({eik});
    const emailCheck = await this.findOne({email});
    if(eikCheck===undefined&&emailCheck===undefined)
    {
      let firm:Firm = new Firm();
      firm.address=address;
      firm.phoneNumber=phoneNumber;
      firm.email = email;
      firm.eik = eik;
      firm.city = city;
      firm.firmName = firmName;
      const saltRounds=10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(password,salt);
      firm.salt=salt;
      firm.passHash=hashed;
      firm.verified = false;
      firm.moderationVerified = false;
      await firm.save();
      return true;

    }
    else 
    {
      return false;
    }
  }
  async getProfile(eik:string)
  {
    const firm:Firm = await this.findOne({eik});
    delete firm.passHash;
    delete firm.salt;
    delete firm.id;
    return firm;
  }

  async loginFirm(eik:string,password:string)
  {
    const firm:Firm = await this.findOne({eik});
    if(!firm)
    {
      return undefined;
    } 
    else
    {
      const hashed = await bcrypt.hash(password,firm.salt);
      if(hashed === firm.passHash)
      {
        if(!firm.verified)
        {
          return "notVerified";
        }
        else if(!firm.moderationVerified)
        {
          return "notModerationVerified";
        }
        else
        {
          return true;
        }
      }
      else
      {
        return undefined;
      }
    }
  }
  async getTaxiDrivers(eik:string)
  {
    let firm:Firm = await this.findOne({eik});
    return firm.drivers;
  }
  async removeTaxiDriver(eik:string, driver:User)
  {
    let firm:Firm = await this.findOne({eik});
      firm.drivers.splice(firm.drivers.indexOf(driver), 1);
      driver.firm=undefined;
      driver.role=UserRoles.USER;
      await firm.save();
      await driver.save();
      return true;
    
  }
  async addTaxiDriver(eik:string, driver:User)
  {
    let firm:Firm = await this.findOne({eik});
    if(!firm.verified)
    {
      return false;
    }
    else
    {
      firm.drivers.push(driver);
      driver.firm=firm;
      driver.role=UserRoles.DRIVER;
      await firm.save();
      await driver.save();
      return true;
    }
  }
  async verifyFirm(eik:string)
  {
    let firm:Firm = await this.findOne({ eik });
    if (firm.verified)
    {
      return false;  
    }
    else
    {
      firm.verified = true;
      await firm.save();
      return true;
    }
  }
}