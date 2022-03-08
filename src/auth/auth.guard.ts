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
      const authTokenFromCookie = request.cookies.authToken;
      const who = authTokenFromCookie && this.jwtService.verify(authTokenFromCookie);

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
