import { EntityRepository, Repository } from "typeorm";
import { Firm } from "./firm.entity";

@EntityRepository(Firm)
export class FirmRepository extends Repository<Firm>
{
  async registerFirm()
  {
    
  }
}