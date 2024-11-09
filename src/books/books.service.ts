import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Book, BookDocument } from './books.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './createbook.dto';
@Injectable()
export class BooksService {
    constructor(
        @InjectModel(Book.name) private BookModel: Model<BookDocument>
    ){}


    public async createBook(CreateBookDto:CreateBookDto):Promise<{message:string , Book:Book}>{
        try {
            console.log(CreateBookDto.genre , "ge");
            const book = await this.BookModel.create(CreateBookDto)
            await book.save()
            console.log("book are" , book);
            
            return {
                message:"Book created Successfully",
                Book:book
            }
        } catch (error) {
            throw new UnauthorizedException("Cannot create book")
        }
    }
}
