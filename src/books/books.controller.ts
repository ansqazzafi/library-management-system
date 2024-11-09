import { Body, Controller , Post, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { GenreValidationPipe } from './CustomPipesForBooks/genre-validation.pipe';
import { CreateBookDto } from './createbook.dto';
import { Book } from './books.model';
import { BooksService } from './books.service';
import { VerifyAdminGuard } from './Guard/verifyAdmin.guard';

@Controller('books')
export class BooksController {

    constructor(private readonly bookService:BooksService){}
    @Post('createBook')
    @UseGuards(VerifyAdminGuard)
    @UsePipes(GenreValidationPipe) 
    public async createBook(@Body() createBookDto: CreateBookDto): Promise<{ message: string, Book: Book }> {
        console.log("genre", createBookDto.genre);
        
        return await this.bookService.createBook(createBookDto);
    }

}
