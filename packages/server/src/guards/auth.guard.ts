import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import JwtService from '~/services/jwt/jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Invalid bearer token');
    }

    const isTokenValid = this.jwtService.isValidToken(token);
    if (!isTokenValid) {
      return false;
    }

    const user = this.jwtService.decodeToken(token);
    if (!user) {
      return false;
    }

    const userExists = await this.userRepository.findOneById(user.id);
    if (!userExists) {
      return false;
    }

    request.user = user;
    return true;
  }
}
