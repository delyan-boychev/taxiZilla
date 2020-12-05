import { Injectable, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { tmpdir } from 'os';
import { UserRoles } from 'src/auth/enums/userRoles.enum';
import { UserStatus } from 'src/auth/enums/userStatus.enum';
import { taxiDriver, taxiDriversFindNearest } from 'src/auth/taxiDriver.class';
import { UserRepository } from 'src/auth/user.repository';
import { Statuses, Drivers,x,y } from 'src/coordsAndStatus.array';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
        @InjectRepository(OrderRepository)
        private orderRepository:OrderRepository,
        private jwtService:JwtService,
            
    ){};
    async renewArray():Promise<void>
    {
        let qb = this.userRepository.createQueryBuilder("user");
        qb.andWhere("user.role = :role", {role: UserRoles.DRIVER});
        let drivers1 = await qb.getMany();
        while(Drivers.length!==0)
        {
            Drivers.pop();
        }
        for(let i = 0; i < drivers1.length; i++)
        {
            if(Statuses[drivers1[i].id]===UserStatus.Online)
            {
                let tmp:taxiDriver = new taxiDriver();
                tmp.driver=drivers1[i];
                tmp.x = x[drivers1[i].id];
                tmp.y = y[drivers1[i].id];
                Drivers.push(tmp);
            }   
        }
        
    }
    async createOrder(x:number,y:number, notes:string, @Session() session:{token?:string})
    {
        this.renewArray();
        let a:taxiDriversFindNearest = new taxiDriversFindNearest;
        let nearest = await a.getTheNearestDriver();
        if(nearest===undefined)return false;
        let uemail = await this.jwtService.decode(session.token);
        let sended = await this.userRepository.findOne({email:uemail["email"]});
        this.orderRepository.createOrder(sended,nearest,x,y, notes); 
    }

}
