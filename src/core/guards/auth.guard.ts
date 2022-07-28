import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.fetchUser(request);
  }

  // Validate and bind user
  private async fetchUser(request) {
    const user = await Promise.resolve({ userId: 'UUId', role: 'user' });
    if (user) {
      request.user = user;
      return true;
    } else {
      return false;
    }
  }
}
