import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
import { Role } from './role/role.enum';
import { UserEntity } from '../users/entities/user.entity';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    return requireRoles.some((role) => user.roles.includes(role));
  }
}
