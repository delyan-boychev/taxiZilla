import { Drivers, Requests } from "src/coordsAndStatus.array";
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
    constructor(x:number, y:number)
    {
        this.x=x;
        this.y=y;
    }
    x: number;
    y: number;
    private taxiDriversDistance: Array<Pair> = new Array<Pair>();
    calculateDistance()
    {
        let i:number;
        this.taxiDriversDistance = []
        for(i=0; Drivers.length; i++)
        {
            if(Drivers[i])
            {
                if(!this.taxiDriversDistance[i])
                {
                    this.taxiDriversDistance[i] = {
                        distance:0,
                        index:i,};
                }
                this.taxiDriversDistance[i].distance = Math.sqrt(Math.pow(this.x - Drivers[i].x, 2) + Math.pow(this.y - Drivers[i].y, 2))
                this.taxiDriversDistance[i].index=i;
            }
        }
    }
    async getTheNearestDriver(): Promise<User>
    {
        this.calculateDistance();
        this.taxiDriversDistance.sort(function(item1,item2){
            if(item2.distance>item1.distance)return -1;
            else if(item2.distance===item1.distance)return 0;
            else return 1;
        });
        var index = -1;
        let i:number;
        setTimeout(async function(){
            for(i=0; i<this.taxiDriversDistance.length; i++)
            {
                Requests[Drivers[this.taxiDriversDistance[i].index].driver.id]={
                    x:this.x,
                    y:this.y,
                    status:0,
                };
                await new Promise(r =>setTimeout(r, 13000)); 
                if(Requests[Drivers[this.taxiDriversDistance[i].index].driver.id].status==1)
                {
                    index=i;
                    break;
                }
            }
        },40);   
        if(index!=-1)return Drivers[index].driver;
        else return undefined;
    }
}