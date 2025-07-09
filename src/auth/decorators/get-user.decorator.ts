import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  if (!user) throw new InternalServerErrorException('User not found');

  if (data) return user[data];

  return user;
});

// Decorator to get store ID from user context
export const GetStoreId = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new InternalServerErrorException('User not found');

    if (!user.storeId)
      throw new InternalServerErrorException(
        'Store ID not found in user context',
      );

    return user.storeId;
  },
);
