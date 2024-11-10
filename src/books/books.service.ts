import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Book, BookDocument } from './books.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './createbook.dto';
import { UpdateBookDto } from './updateBook.dto';
import { CustomNotFoundException } from './CustomExceptions/customNotFountException.filter';
@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private BookModel: Model<BookDocument>) {}

  public async createBook(
    CreateBookDto: CreateBookDto,
  ): Promise<{ message: string; Book: Book }> {
    console.log(CreateBookDto.genre, 'ge');
    const book = await this.BookModel.create(CreateBookDto);
    await book.save();
    console.log('book are', book);

    return {
      message: 'Book created Successfully',
      Book: book,
    };
  }

  public async updateBook(
    UpdateBookDto: UpdateBookDto,
    id: string,
  ): Promise<{ message: string; Book: Book }> {
    const book = await this.BookModel.findById(id);
    if (!book) {
      throw new CustomNotFoundException('Book not found');
    }

    Object.assign(book, UpdateBookDto);
    await book.save();
    return {
      message: 'Book updated Succesfully',
      Book: book,
    };
  }

  public async deleteBook(
    id: string,
  ): Promise<{ message: string; Book: Book }> {
    const book = await this.BookModel.findById(id);

    if (!book) {
      throw new CustomNotFoundException('Book not found');
    }
    await this.BookModel.deleteOne({ _id: id });

    return {
      message: 'Book deleted successfully',
      Book: book,
    };
  }

  public async listBooks(paginationParams: { page: number; limit: number }) {
    const { page, limit } = paginationParams;
    const books = await this.BookModel.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.BookModel.countDocuments();

    return {
      data: books,
      total,
      page,
      limit,
    };
  }


  public async findBookByName(name: string): Promise<Book[]> {
    return this.BookModel.find({ bookName: { $regex: name, $options: 'i' } }).exec();
  }
}
