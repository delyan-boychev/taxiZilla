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
    let newAddress = new SavedAddress();
    newAddress.user=sender;
    newAddress.city=city;
    newAddress.address=address;
    await newAddress.save();
    return true;
  }
  async getUserAddresses(sender:User)
  {
    return sender.savedAddresses;
  }
  async deleteAddress(sender:User, addressId:number)
  {
    let address = await this.findOne(addressId);
    if(!address)throw new BadRequestException();
    if(address.user!=sender && sender.role!=UserRoles.ADMIN)
    {
        throw new UnauthorizedException();
    }
    await address.remove();
  }
}