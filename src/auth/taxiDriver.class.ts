import { Drivers, Requests, Statuses } from "src/coordsAndStatus.array";
import { UserStatus } from "./enums/userStatus.enum";
import { User } from "./user.entity";

export class taxiDriver
{
    driver:User;
    x: number;
    y: number;
}
export class Pair
{
    index:number;
    distance:number;
}
export class taxiDriversFindNearest
{
    constructor(x:number, y:number,sender:User,notes:string, address:string)
    {
        this.x=x;
        this.y=y;
        this.address = address;
        this.notes=notes;
        this.sender=sender;
    }
    address: string;
    x: number;
    y: number;
    notes:string;
    sender:User;
    private taxiDriversDistance: Array<Pair> = new Array<Pair>();
    calculateDistance()
    {
        let i:number;
        this.taxiDriversDistance = []
        for(i=0; i < Drivers.length; i++)
        {
            if(Drivers[i])
            {
 
                if(!this.taxiDriversDistance[i])
                {
                    this.taxiDriversDistance[i] = {
                        distance:0,
                        index:i,};
                }
                this.taxiDriversDistance[i].distance = Math.sqrt(Math.pow(this.x - Drivers[i].x, 2) + Math.pow(this.y - Drivers[i].y, 2));
                this.taxiDriversDistance[i].index=i;
            }
        }
    }
    getTheNearestDriver(): void
    {
        this.calculateDistance();
        this.taxiDriversDistance.sort(function(item1,item2){
            if(item2.distance>item1.distance)return -1;
            else if(item2.distance===item1.distance)return 0;
            else return 1;
        });
        var index = -1;
        let i:number = 0;
        console.log(this.taxiDriversDistance[i].distance);
        Requests[Drivers[this.taxiDriversDistance[i].index].driver.id]={
                x:this.x,
                y:this.y,
                address: this.address,
                sender:this.sender,
                status:0,
                distances:this.taxiDriversDistance,
                curdriveridx:0,
        };
    }
}