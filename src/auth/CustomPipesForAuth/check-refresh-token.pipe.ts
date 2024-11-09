
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CheckRefreshTokenPipe implements PipeTransform {
  transform(request: Request) {
    if (!request.cookies || !request.cookies['refreshToken']) {
      throw new BadRequestException('Refresh token not found in cookies');
    }
    return request;
  }
}
