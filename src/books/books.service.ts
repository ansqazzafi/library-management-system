import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Book, BookDocument } from './books.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './createbook.dto';
import { UpdateBookDto } from './updateBook.dto';
import { CustomNotFoundException } from './CustomExceptions/customNotFountException.filter';
import { User } from 'src/auth/user.model';
import { UserDocument } from 'src/auth/user.model';
import { Types } from 'mongoose';
@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private BookModel: Model<BookDocument>,
  @InjectModel(User.name) private userModel: Model<UserDocument>) {}


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


  public async borrowBook(userId:string , bookId:string):Promise<string>{
    const userObjectId = new Types.ObjectId(userId);
    const bookObjectId = new Types.ObjectId(bookId);
    const user = await this.userModel.findById(userId)
    const book = await this.BookModel.findById(bookId)

    if(!user){
      throw new CustomNotFoundException("User not found with given user id")
    }

    if(!book){
      throw new CustomNotFoundException("Book not found with given book id")
    }

    if (user.borrowedBooks.includes(bookObjectId)) {
      throw new Error('User has already borrowed this book');
    }

    if(book.numberOfCopiesAvailable <=0){
      throw new ConflictException("Book are not available yet")
    }

    book.numberOfCopiesAvailable -=1
    user.borrowedBooks.push(bookObjectId)
    book.borrowedBy.push(userObjectId)

    await user.save()
    await book.save()


    return `User ${user.firstName} successfully Borrowed the book with ID: ${bookId}`;
  }

  public async returnBook(userId: string, bookId: string): Promise<string> {
    const userObjectId = new Types.ObjectId(userId);
    const bookObjectId = new Types.ObjectId(bookId);
    const user = await this.userModel.findById(userObjectId);
    const book = await this.BookModel.findById(bookObjectId);

    if (!user) {
      throw new CustomNotFoundException("User not found with the given user ID");
    }
    if (!book) {
      throw new CustomNotFoundException("Book not found with the given book ID");
    }
    const borrowedBookIndex = user.borrowedBooks.findIndex(id => id.equals(bookObjectId));
    
    if (borrowedBookIndex === -1) {
      throw new ConflictException("User did not borrow this book");
    }
    user.borrowedBooks.splice(borrowedBookIndex, 1); 
    const borrowedByIndex = book.borrowedBy.findIndex(id => id.equals(userObjectId));
    if (borrowedByIndex !== -1) {
      book.borrowedBy.splice(borrowedByIndex, 1); 
    }
    book.numberOfCopiesAvailable += 1; 
    await user.save();
    await book.save();
  
    return `User ${user.firstName} successfully returned the book with ID: ${bookId}`;
  }
}
