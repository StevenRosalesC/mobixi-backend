import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserStores = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string[] => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return [];
    }

    // For STORE_ADMIN, return array of store IDs
    if (user.role === 'STORE_ADMIN') {
      return user.storeIds || [];
    }

    // For USER, return single store ID as array
    if (user.role === 'USER' && user.storeId) {
      return [user.storeId];
    }

    return [];
  },
); 