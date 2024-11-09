import { Module } from '@nestjs/common';
import { User } from './user.model';
import { UserSchema } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name , schema:UserSchema}])
    ],
    controllers:[AuthController],
    providers:[AuthService , JwtService]
})
export class AuthModule {
}
