import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ServerException,
  ServerExceptionCode,
} from '../models/server.exception.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!roles.includes(user.role)) {
      throw new ServerException(
        ServerExceptionCode.RefuseRequest,
        'User does not have permission!',
      );
    }
    return true;
  }
}
