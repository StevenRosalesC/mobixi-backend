import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { STORE_REQUIRED_KEY } from '../decorators/store-required.decorator';

@Injectable()
export class StoreRequiredGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const storeRequired = this.reflector.get<boolean>(
      STORE_REQUIRED_KEY,
      context.getHandler(),
    );

    if (!storeRequired) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // For STORE_ADMIN, check if they have any stores assigned
    if (user.role === 'STORE_ADMIN') {
      if (!user.storeIds || user.storeIds.length === 0) {
        throw new ForbiddenException('Store IDs required for this operation');
      }
    } else if (user.role === 'USER') {
      // For USER, check if they have a store assigned
      if (!user.storeId) {
        throw new ForbiddenException('Store ID required for this operation');
      }
    }

    return true;
  }
}
