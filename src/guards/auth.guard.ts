import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import JwtService from '~/services/jwt/jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    const isTokenValid = this.jwtService.isValidToken(token);
    if (!isTokenValid) {
      return false;
    }

    const user = this.jwtService.decodeToken(token);
    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }
}
