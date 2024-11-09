import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: false })
    phoneNumber: string;

    @Prop({required : true})
    password:string

    @Prop({ default: 'user' }) 
    role: string;

    @Prop({required : false})
    refreshToken:string

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);