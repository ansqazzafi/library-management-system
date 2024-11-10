import { Module } from '@nestjs/common';
import { Book, BookSchema } from './books.model';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/user.model';
import { UserSchema } from 'src/auth/user.model';
@Module({
    imports:[
        MongooseModule.forFeature([{name:Book.name , schema:BookSchema}]),
        MongooseModule.forFeature([{name:User.name , schema:UserSchema}])
    ],
    controllers:[BooksController],
    providers:[BooksService , JwtService]
})
export class BooksModule {

}
