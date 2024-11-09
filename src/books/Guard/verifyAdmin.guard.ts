import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyAdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['accessToken'];
    console.log(token, 'token');
    if (!token) {
      throw new ForbiddenException('Authorization token not provided');
    }
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: process.env.ACCESS_KEY,
    });
    console.log('Decoded token:', decoded);
    if (!decoded || decoded.role !== 'admin') {
      throw new ForbiddenException('Access restricted to admins');
    }
    request.user = decoded;
    return true;
  }
}
