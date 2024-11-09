import { Module } from '@nestjs/common';
import { Book, BookSchema } from './books.model';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Book.name , schema:BookSchema}])
    ],
    controllers:[BooksController],
    providers:[BooksService , JwtService]
})
export class BooksModule {

}
