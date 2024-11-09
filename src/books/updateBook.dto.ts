import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { GenreEnum } from './enums.genere';

export class UpdateBookDto {
    @IsOptional()
    @IsString()
    bookName: string;

    @IsOptional()
    @IsString()
    bookDescription: string;

    @IsOptional()
    @IsString()
    authorName: string;

    @IsOptional()
    @IsEnum(GenreEnum)
    genre: GenreEnum;

    @IsOptional()
    @IsString()
    publishedDate: string;

    @IsOptional()
    @IsNumber()
    numberOfCopiesAvailable: number;
}
