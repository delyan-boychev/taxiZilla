import { ExecFileSyncOptionsWithBufferEncoding } from "child_process";
import { IsNotEmpty, IsNumber, IsNumberString, Length } from "class-validator";

export class CreateOrderDTO
{
    @IsNumber()
    x:number;

    @IsNumber()
    y:number;

    notes:string;

    items:string;

    @IsNotEmpty()
    key:string;

    @IsNumberString()
    offset:string;

    address:string;



}