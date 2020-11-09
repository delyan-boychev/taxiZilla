import { IsNotEmpty, IsNumberString } from 'class-validator'

export class RegisterFirmDTO
{
  @IsNotEmpty()
  eik:string; 

  
  
}