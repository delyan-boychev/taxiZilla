import { IsEmail, IsMobilePhone, IsNotEmpty } from "class-validator";

export class RegisterUserDTO
{
  @IsNotEmpty()
  fName: string;

  @IsNotEmpty()
  lName: string;

  @IsEmail()
  email: string;

  @IsMobilePhone('bg-BG')
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}