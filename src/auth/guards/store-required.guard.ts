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

    if (!user.storeId) {
      throw new ForbiddenException('Store ID required for this operation');
    }

    return true;
  }
}
