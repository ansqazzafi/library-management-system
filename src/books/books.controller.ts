import {
  Body,
  Controller,
  Post,
  UseGuards,
  Delete,
  UsePipes,
  Put,
  Param,
  Get,
  Query,
  UseInterceptors
} from '@nestjs/common';

import { GenreValidationPipe } from './CustomPipesForBooks/genre-validation.pipe';
import { CreateBookDto } from './createbook.dto';
import { Book } from './books.model';
import { BooksService } from './books.service';
import { VerifyAdminGuard } from './Guard/verifyAdmin.guard';
import { UpdateBookDto } from './updateBook.dto';
import { PaginationPipe } from './CustomPipesForBooks/pagination.pipe';
import { CustomNotFoundException } from './CustomExceptions/customNotFountException.filter';
import { VerifyJwtInterceptor } from './Interceptor/verifyJwt.interceptor';
@Controller('api/books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Post('createBook')
  @UseGuards(VerifyAdminGuard)
  @UsePipes(GenreValidationPipe)
  public async createBook(
    @Body() createBookDto: CreateBookDto,
  ): Promise<{ message: string; Book: Book }> {
    return await this.bookService.createBook(createBookDto);
  }

  @Put('updateBook/:id')
  @UseGuards(VerifyAdminGuard)
  @UsePipes(GenreValidationPipe)
  public async updateBook(
    @Body() updateBookDto: UpdateBookDto,
    @Param('id') id: string,
  ): Promise<{ message: string; Book: Book }> {
    return await this.bookService.updateBook(updateBookDto, id);
  }

  @Delete('deleteBook/:id')
  @UseGuards(VerifyAdminGuard)
  public async deleteBook(
    @Param('id') id: string,
  ): Promise<{ message: string; Book: Book }> {
    return await this.bookService.deleteBook(id);
  }

  @Get('list')
  @UsePipes(PaginationPipe)
  public async listBooks(
    @Query() paginationParams: { page: number; limit: number },
  ): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    return await this.bookService.listBooks(paginationParams);
  }

  @Get('findByName')
  public async findBookByName(@Query('name') name: string): Promise<Book[]> {
    const books = await this.bookService.findBookByName(name);
    if (books.length === 0) {
      throw new CustomNotFoundException(`No books found with name containing "${name}"`);
    }
    return books;
  }


  @Post('borrowBook/:userId/:bookId')
  @UseInterceptors(VerifyJwtInterceptor)
  public async borrowBook(@Param('userId') userId:string , @Param('bookId') bookId:string):Promise<string>{
    return await this.bookService.borrowBook(userId , bookId)
  }

  @Post('returnBook/:userId/:bookId')
  @UseInterceptors(VerifyJwtInterceptor)
  public async returnBook(@Param('userId') userId:string , @Param('bookId') bookId:string):Promise<string>{
    return await this.bookService.returnBook(userId , bookId)
  }






}
