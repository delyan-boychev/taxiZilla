import { EntityRepository, Repository } from "typeorm";
import { ModeratorOperation } from "./modOperation.entity";

@EntityRepository(ModeratorOperation)
export class ModOperationRepository extends Repository<ModeratorOperation>
{
    async createNewLogItem(modEmail:string,action:string)
    {
        let operation = new ModeratorOperation();
        operation.moderatorEmail=modEmail;
        operation.action=action;
        let dateTime = new Date();
        operation.timeStamp=dateTime.toUTCString();
        await operation.save();
    }
}