import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required permission from metadata
    const permission = this.reflector.get<{ module: string; action: string }>(
      PERMISSION_KEY,
      context.getHandler(),
    );
    if (!permission) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new ForbiddenException('User not found');

    const { module, action } = permission;
    const userPermissions = user.permissions || {};

    // Check if user has the required permission
    if (
      userPermissions[module] &&
      Array.isArray(userPermissions[module]) &&
      userPermissions[module].includes(action)
    ) {
      return true;
    }

    throw new ForbiddenException(
      `User does not have permission to ${action} on ${module}`,
    );
  }
}
