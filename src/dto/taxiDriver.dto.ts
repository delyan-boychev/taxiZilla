export class taxiDriverDTO
{
    email: string;
    x: number;
    y: number;
}
export class taxiDriversFindNearestDto
{
    x: number;
    y: number;
    taxiDrivers: Array<taxiDriverDTO>; 
    private taxiDriversDistance: Array<number> = new Array<number>();
    calculateDistance()
    {
        let i:number;
        for(i=0; i<this.taxiDrivers.length; i++)
        {
            this.taxiDriversDistance[i] = Math.sqrt(Math.pow(this.x - this.taxiDrivers[i].x, 2) + Math.pow(this.y - this.taxiDrivers[i].y, 2))
        }
    }
    getTheNearestDriver(): string
    {
        var min = this.taxiDriversDistance[0];
        var index = 0;
        let i:number;
        for(i=0; i<this.taxiDriversDistance.length; i++)
        {
            if(this.taxiDriversDistance[i]<min)
            {
                index = i;
                min =this.taxiDriversDistance[i];
            }
        }
        return this.taxiDrivers[index].email;
    }
}