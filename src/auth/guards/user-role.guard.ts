import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new ForbiddenException('User not found');

    if (validRoles.includes(user.role)) return true;

    throw new ForbiddenException(
      `User ${user.email} does not have permission to access this route`,
    );
  }
}
