import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class VerifyJwtInterceptor implements NestInterceptor {
    constructor(private readonly jwtService: JwtService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies['accessToken']; 
  
      if (!token) {
        throw new UnauthorizedException('Access token missing');
      }
  
      try {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.ACCESS_KEY,
        });
        request.user = decoded; 
        
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
  
      return next.handle(); 
    }
  }
  