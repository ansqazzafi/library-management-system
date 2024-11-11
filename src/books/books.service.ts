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
    @InjectModel(User.name) private userModel: Model<UserDocument>) { }


  public async createBook(
    CreateBookDto: CreateBookDto,
  ): Promise<{ message: string; Book: Book }> {
    const createdBook = new this.BookModel({
      ...CreateBookDto
    })
    await createdBook.save()
    return {
      message: 'Book created Successfully',
      Book: createdBook,
    };
  }

  public async updateBook(
    UpdateBookDto: UpdateBookDto,
    id: string,
  ): Promise<{ message: string; Book: Book }> {
    const book = await this.BookModel.findByIdAndUpdate(
      id,
      { $set: UpdateBookDto },
      { new: true, runValidators: true }
    );
    if (!book) {
      throw new CustomNotFoundException('Book not found');
    }

    return {
      message: 'Book updated successfully',
      Book: book,
    };
  }


  public async deleteBook(id: string): Promise<{ message: string; Book: Book }> {
    const book = await this.BookModel.findOneAndDelete({ _id: id });
    if (!book) {
      throw new CustomNotFoundException('Book not found');
    }
    return {
      message: 'Book deleted successfully',
      Book: book,
    };
  }


  // public async listBooks(paginationParams: { page: number; limit: number }) {
  //   const { page, limit } = paginationParams;
  //   const books = await this.BookModel.find()
  //     .skip((page - 1) * limit)
  //     .limit(limit);
  //   const total = await this.BookModel.countDocuments();

  //   return {
  //     data: books,
  //     total,
  //     page,
  //     limit,
  //   };
  // }



  public async listBooks(paginationParams: { page: number; limit: number }) {
    const { page, limit } = paginationParams;
    const [result] = await this.BookModel.aggregate([
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          total: [
            { $count: 'total' },
          ],
        },
      },
    ]);
    const total = result?.total[0]?.total || 0;
    return {
      data: result.data,
      total,
      page,
      limit,
    };
  }



  public async findBookByName(name: string): Promise<Book[]> {
    return this.BookModel.find({ bookName: { $regex: name, $options: 'i' } }).exec();
  }


  public async borrowBook(userId: string, bookId: string): Promise<string> {
    const userObjectId = new Types.ObjectId(userId);
    const bookObjectId = new Types.ObjectId(bookId);
    const session = await this.BookModel.startSession();
    session.startTransaction();

    const [user, book] = await Promise.all([
      this.userModel.findById(userObjectId).session(session),
      this.BookModel.findById(bookObjectId).session(session),
    ]);

    if (!user) {
      throw new CustomNotFoundException("User not found with given user id");
    }

    if (!book) {
      throw new CustomNotFoundException("Book not found with given book id");
    }

    if (user.borrowedBooks.includes(bookObjectId)) {
      throw new Error('User has already borrowed this book');
    }

    if (book.numberOfCopiesAvailable <= 0) {
      throw new ConflictException("Book is not available yet");
    }

    book.numberOfCopiesAvailable -= 1;
    user.borrowedBooks.push(bookObjectId);
    book.borrowedBy.push(userObjectId);

    await Promise.all([
      user.save({ session }),
      book.save({ session }),
    ]);

    await session.commitTransaction();
    session.endSession();
    return `User ${user.firstName} successfully borrowed the book with ID: ${bookId}`;
  }


  public async returnBook(userId: string, bookId: string): Promise<string> {
    const userObjectId = new Types.ObjectId(userId);
    const bookObjectId = new Types.ObjectId(bookId);
  
    const session = await this.BookModel.startSession();
    session.startTransaction();
  
      const [user, book] = await Promise.all([
        this.userModel.findById(userObjectId).session(session),
        this.BookModel.findById(bookObjectId).session(session),
      ]);
  
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
  
      await Promise.all([
        user.save({ session }),
        book.save({ session }),
      ]);
  
      await session.commitTransaction();
      session.endSession();
  
      return `User ${user.firstName} successfully returned the book with ID: ${bookId}`;
  }
  
}
