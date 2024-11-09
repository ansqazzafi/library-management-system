

import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  role: string = 'user'; 

  @IsString()
  @IsOptional()
  refreshToken?: string;
}