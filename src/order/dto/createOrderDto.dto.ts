import { ExecFileSyncOptionsWithBufferEncoding } from "child_process";
import { IsNotEmpty, IsNumber, IsNumberString, Length } from "class-validator";

export class CreateOrderDTO
{
    @IsNumberString()
    x:string;

    @IsNumberString()
    y:string;

    notes:string;

    items:string;

    @IsNotEmpty()
    key:string;

    @IsNumberString()
    offset:string;

    address:string;



}