import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class VerifyAdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['accessToken'];

    if (!token) {
      throw new ForbiddenException('Authorization token not provided');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_KEY,
      });
      if (!decoded || decoded.role !== 'admin') {
        throw new ForbiddenException('Access restricted to admins');
      }
      request.user = decoded;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      throw new ForbiddenException('Access denied Only Admin can Perform this Action');
    }
  }
}
