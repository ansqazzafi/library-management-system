import { IsString, IsEmail, IsOptional, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { GenreEnum } from './enums.genere';
export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  bookName: string;
  
  @IsString()
  @IsNotEmpty()
  bookDescription: string;

  @IsString()
  @IsNotEmpty()
  authorName: string;


  @IsString()
  @IsNotEmpty()
  publishedDate: string;

  @IsEnum(GenreEnum)
  genre: GenreEnum;

  @IsNumber()
  @IsNotEmpty()
  numberOfCopiesAvailable: number;
}