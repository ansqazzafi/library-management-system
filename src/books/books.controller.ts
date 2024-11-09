import { Body, Controller , Post, UseGuards, Delete, UsePipes , Put , Param } from '@nestjs/common';
import { GenreValidationPipe } from './CustomPipesForBooks/genre-validation.pipe';
import { CreateBookDto } from './createbook.dto';
import { Book } from './books.model';
import { BooksService } from './books.service';
import { VerifyAdminGuard } from './Guard/verifyAdmin.guard';
import { UpdateBookDto } from './updateBook.dto';

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

    @Put('updateBook/:id')
    @UseGuards(VerifyAdminGuard)
    @UsePipes(GenreValidationPipe)
    public async updateBook(@Body() updateBookDto: UpdateBookDto,@Param('id') id: string ): Promise<{ message: string; Book: Book }> {
      return await this.bookService.updateBook(updateBookDto, id);  
    }

    @Delete('deleteBook/:id')
    @UseGuards(VerifyAdminGuard)
    public async deleteBook(@Param('id') id:string):Promise<{ message: string, Book: Book }> {
        return await this.bookService.deleteBook(id)
    }

}
