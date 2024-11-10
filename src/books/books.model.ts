import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GenreEnum } from './enums.genere';
import { IsEnum } from 'class-validator';
import { User } from 'src/auth/user.model';
@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  bookName: string;

  @Prop({ required: true })
  bookDescription: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  publishedDate: Date;

  @IsEnum(GenreEnum)
  @Prop({ required: true })
  genre: GenreEnum;

  @Prop({ required: true })
  numberOfCopiesAvailable: number;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  borrowedBy: Types.ObjectId[];
}

export type BookDocument = Book & Document;
export const BookSchema = SchemaFactory.createForClass(Book);
