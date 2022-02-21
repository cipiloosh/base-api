import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const who =
        authHeader && this.jwtService.verify(authHeader.replace('Bearer ', ''));

      if (!who) {
        return false;
      }

      request.user = { ...who };
      return true;
    } catch (error) {
      return false;
    }
  }
}
