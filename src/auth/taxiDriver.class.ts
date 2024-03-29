import { Drivers, Requests} from "src/coordsAndStatus.array";
import { UserStatus } from "./enums/userStatus.enum";
import { RequestsTimestamps } from "./timestamps.exports";
import { User } from "./user.entity";

//Тук се случва намирането на най-близък шофьор
export class taxiDriver
{
    driver:User;
    status:UserStatus;
    x: number;
    y: number;
}
export class orderMessage
{
    constructor(accepted:boolean, driverName:string)
    {
        this.isAccepted = accepted;
        this.driverName = driverName;
    }
    isAccepted:boolean;
    driverName:string;
}
export class Pair
{
    index:number;
    distance:number;
}
export class taxiDriversFindNearest
{
    constructor(x:number, y:number,sender:User,notes:string, address:string, ip:string, items:string, phoneNumber:string)
    {
        this.x=x;
        this.y=y;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.notes=notes;
        this.sender=sender;
        this.ip = ip;
        this.items = items;
    }
    phoneNumber:string;
    items: string;
    address: string;
    x: number;
    y: number;
    ip:string;
    notes:string;
    sender:User;
    //Всички шофьори влизат в масив с тяхната дистанция и индекса на шофьора. Дистанцията се пресмята по формулата за разстояние на точки
    private taxiDriversDistance: Array<Pair> = new Array<Pair>();
    calculateDistance()
    {
        let i:number;
        let k:number = 0;
        this.taxiDriversDistance = []
        for(i=0; i < Drivers.length; i++)
        {
            if(Drivers[i])
            {
                    if(Requests[i] === undefined)
                    {
        
                    if(!this.taxiDriversDistance[i])
                    {
                        this.taxiDriversDistance[i] = {
                            distance:0,
                            index:k,};
                    }
                    this.taxiDriversDistance[i].distance = Math.sqrt(Math.pow(this.x - Drivers[i].x, 2) + Math.pow(this.y - Drivers[i].y, 2));
                    this.taxiDriversDistance[i].index=i;
                    }
            }
        }
    }
    //Този масив се сортира по дистанция във възходящ ред и се изпраща заявка на най-близкия шофьор (0 индекс в масива)
    getTheNearestDriver(): void
    {
        this.calculateDistance();
        this.taxiDriversDistance.sort(function(item1,item2){
            //Колбак за сравняване използван от функцията sort с цел да знае как да бъдат подредени
            if(item2.distance>item1.distance)return -1;
            else if(item2.distance===item1.distance)return 0;
            else return 1;
        });
        var index = -1;
        let i:number = 0;
        //Инициализация на заявка
        Requests[Drivers[this.taxiDriversDistance[i].index].driver.id]={
                x:this.x,
                y:this.y,
                items: this.items,
                address: this.address,
                sender:this.sender,
                ip:this.ip,
                notes: this.notes,
                status:0,
                distances:this.taxiDriversDistance,
                curdriveridx:0,
                phoneNumber: this.phoneNumber
        };
        RequestsTimestamps[Drivers[this.taxiDriversDistance[i].index].driver.id] = new Date();
    }
}