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
import { log } from 'console';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private async generateAccessToken(user): Promise<string> {
    console.log(user._id , "user");
    const payload = {id:user._id ,firstName:user.firstName , lastName:user.lastName , email: user.email, role: user.role };
    console.log("Payload:" , payload);
    
    const secretKey = process.env.ACCESS_KEY;
    console.log("seceret:" , secretKey);
    
    const expiresIn = process.env.ACCESS_KEY_EXPIRE || '30s';
    return this.jwtService.signAsync(payload, { secret: secretKey, expiresIn });
  }

  private async generateRefreshToken(user): Promise<string> {
    const payload = { id : user._id};
    const secretKey = process.env.REFRESH_KEY;
    const expiresIn = process.env.REFRESH_KEY_EXPIRE || '30d';
    return this.jwtService.signAsync(payload, { secret: secretKey, expiresIn });
  }

  public async RegisterUser(registerUserDto: RegisterUserDto): Promise<User> {
    const user = await this.userModel.create(registerUserDto);
    await user.save();
    return user;
  }

  public async LoginUser(loginUserDto: LoginUserDto): Promise<{ user: User; accessToken: string; refreshToken: string }> {
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
    const id=user._id
    
    
    const accessToken = await this.generateAccessToken(user)
    console.log("access" , accessToken);
    const refreshToken = await this.generateRefreshToken(user)
    console.log(refreshToken);

    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await this.userModel.findById(user._id).select("-password -refreshToken")
    
    return {
        user : loggedInUser,
        accessToken ,
        refreshToken
    }
  }



  public async refreshToken(
    refreshToken: string,
  ): Promise<{message:string,  accessToken: string; refreshToken: string }> {
      const decodedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_KEY,
      });
      const user = await this.userModel.findById(decodedToken.id);
      console.log("user found:" , user);
      
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateRefreshToken(user);
      if(!accessToken || !newRefreshToken){
        throw new ForbiddenException("there is an issue with tokens")
      }
      user.refreshToken = newRefreshToken;
      await user.save();
      return {
        message:"tokens refreshed",
        accessToken,
        refreshToken: newRefreshToken,
      };
  }
  
}
