import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './register-user-dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginUserDto } from './login-user-dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) { }


  public removeFields(obj: any, fields: string[]): any {
    const removedFields = { ...obj };
    fields.forEach(field => delete removedFields[field]);
    return removedFields;
  }


  private async generateAccessToken(user): Promise<string> {
    const payload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    const secretKey = process.env.ACCESS_KEY;

    const expiresIn = process.env.ACCESS_KEY_EXPIRE || '30s';
    return this.jwtService.signAsync(payload, { secret: secretKey, expiresIn });
  }

  private async generateRefreshToken(user): Promise<string> {
    const payload = { id: user._id };
    const secretKey = process.env.REFRESH_KEY;
    const expiresIn = process.env.REFRESH_KEY_EXPIRE || '30d';
    return this.jwtService.signAsync(payload, { secret: secretKey, expiresIn });
  }

  public async RegisterUser(registerUserDto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (existingUser) {
      console.log('enter');
      throw new ConflictException('Email already exists');
    }
    const registeredUser = new this.userModel({ ...registerUserDto });

    return await registeredUser.save();
  }

  public async LoginUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {

    const user = await this.userModel.findOne({ email: loginUserDto.email });


    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordCorrect = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );



    if (!isPasswordCorrect) {
      throw new UnauthorizedException('password didnt matched');
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();


    const newUser = user.toObject();
    const loggedInUser = this.removeFields(newUser , ['password' , 'refreshToken'])

    return {
      user: loggedInUser,
      accessToken,
      refreshToken,
    };
  }

  public async logoutUser(id: string): Promise<{ message: string, loggedOutUser: User }> {
    let user = await this.userModel.findOneAndUpdate(
      { _id: id },
      { $unset: { refreshToken: 1 } },
      { new: true },
    );

    const newUser = user.toObject();
    const loggedOutUser = this.removeFields(newUser , ['password' , 'refreshToken' , 'createdAt' , 'updatedAt' , '__v'])

    return {
      message: "User logged Out Succesfully",
      loggedOutUser: loggedOutUser
    };
  }

  public async refreshToken(
    refreshToken: string,
  ): Promise<{ message: string; accessToken: string; refreshToken: string }> {
    const decodedToken = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.REFRESH_KEY,
    });
    const user = await this.userModel.findById(decodedToken.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);
    if (!accessToken || !newRefreshToken) {
      throw new ForbiddenException('there is an issue with tokens');
    }
    user.refreshToken = newRefreshToken;
    await user.save();
    return {
      message: 'tokens refreshed',
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
