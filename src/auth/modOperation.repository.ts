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
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        const strd =  ("0" + dd).slice(-2) + '-' +  ("0" + mm).slice(-2) + '-' + yyyy + " " +  ("0" + h).slice(-2) + ":" +  ("0" + m).slice(-2) + ":" +  ("0" + s).slice(-2);
        operation.date=strd;
        await operation.save();
    }
}