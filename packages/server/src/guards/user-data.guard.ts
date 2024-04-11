import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserDataGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      return false;
    }

    const canContinue = user.isAdmin || user.id === request.params.id;
    if (!canContinue) {
      return false;
    }

    return true;
  }
}
