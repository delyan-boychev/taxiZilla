import { EntityRepository, Repository } from "typeorm";
import { RegisterFirmDTO } from "./dto/registerFirm.dto";
import { Firm } from "./firm.entity";
import * as bcrypt from 'bcrypt';

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
      await firm.save();
      return true;

    }
    else 
    {
      return false;
    }
  }
  async verifyFirm(eik:string)
  {
    let firm:Firm = await this.findOne({eik});
    if(firm!==undefined)
    {
      firm.verified=true;
      return true;
    }
    else
    {
      return false;
    }
  }
}