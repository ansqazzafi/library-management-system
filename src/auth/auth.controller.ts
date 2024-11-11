import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UsePipes,
  Res,
  Req,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.model';
import { RegisterUserDto } from './register-user-dto';
import { HashPasswordPipe } from './CustomPipesForAuth/hashPassword.pipe';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user-dto';
import { Response, Request } from 'express';
import { CheckRefreshTokenPipe } from './CustomPipesForAuth/check-refresh-token.pipe';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('registerUser')
  @UsePipes(HashPasswordPipe)
  public async RegisterUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<User> {
    return await this.authService.RegisterUser(registerUserDto);
  }

  @Post('login')
  public async LoginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const loggedUser = await this.authService.LoginUser(loginUserDto);
    

    const Options = {
      httpOnly: true,
      secure: true,
    };

    
    response.cookie('accessToken', loggedUser.accessToken, Options);
    response.cookie('refreshToken', loggedUser.refreshToken, Options);
    return {
      user: loggedUser.user,
      accessToken: loggedUser.accessToken,
      refreshToken: loggedUser.refreshToken,
    };
  }

  @Get('refresh-token')
  @UsePipes(CheckRefreshTokenPipe)
  public async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string; accessToken: string; refreshToken: string }> {
    const refreshTokenfromCookie = request.cookies['refreshToken'];

    const Respond=
      await this.authService.refreshToken(refreshTokenfromCookie);
    const Options = {
      httpOnly: true,
      secure: true,
    };
    response.cookie('accessToken', Respond.accessToken, Options);
    response.cookie('refreshToken', Respond.refreshToken, Options);

    return Respond
  }


  @Post('logout')
  public async logoutUser(@Body() { userId }: { userId: string },  @Res({ passthrough: true }) response: Response): Promise<{message:string , loggedOutUser:User}>  {
    const responseFromService = await this.authService.logoutUser(userId);
    const Options = {
      httpOnly: true,
      secure: true,
    };
    if (responseFromService) {
      response.clearCookie('accessToken' , Options);
      response.clearCookie('refreshToken' , Options);
    }

    return responseFromService

  }
}
