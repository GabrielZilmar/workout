import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import JwtService from '~/services/jwt/jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
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

    const userExists = await this.userRepository.findOneById(user.id);
    if (!userExists) {
      return false;
    }

    request.user = user;
    return true;
  }
}
