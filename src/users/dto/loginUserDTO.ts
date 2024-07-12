import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class loginUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
