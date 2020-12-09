import { IsEmail, IsMobilePhone, IsNotEmpty, IsNumberString } from 'class-validator'

export class RegisterFirmDTO
{
  @IsNotEmpty()
  eik:string; 

  @IsNotEmpty()
  firmName:string;

  @IsEmail()
  email:string;

  @IsMobilePhone('bg-BG')
  phoneNumber:string;

  @IsNotEmpty()
  password:string;
  
  @IsNotEmpty()
  address:string;

  @IsNotEmpty()
  city:string;

}