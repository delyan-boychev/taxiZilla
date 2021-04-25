import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { UserRoles } from "./enums/userRoles.enum";
import { SavedAddress } from "./savedAddress.entity";
import { User } from "./user.entity";

@EntityRepository(SavedAddress)
export class SavedAddressRepository extends Repository<SavedAddress>
{
  async saveUserAddress(sender:User,city:string,address:string)
  {
    const qb = this.createQueryBuilder("SavedAddress");
    qb.andWhere("SavedAddress.userId = :sid", { sid: sender.id});
    qb.andWhere("SavedAddress.city = :city", {city: city});
    qb.andWhere("SavedAddress.address = :address", {address: address});
    if(!await qb.getOne())
    {
      let newAddress = new SavedAddress();
      newAddress.user=sender;
      newAddress.city=city;
      newAddress.address=address;
      await newAddress.save();
    }
    return true;
  }
  async getUserAddresses(sender:User)
  {
    const qb = this.createQueryBuilder("SavedAddress");
    qb.andWhere("SavedAddress.userId = :sid", { sid: sender.id})
    return await qb.getMany();
  }
  async deleteAddress(sender:User, addressId:number)
  {
    let address = await this.findOne(addressId);
    if(!address)throw new BadRequestException();

    if(address.userId!=sender.id && sender.role!=UserRoles.ADMIN)
    {
        throw new UnauthorizedException();
    }
    await address.remove();
  }
}