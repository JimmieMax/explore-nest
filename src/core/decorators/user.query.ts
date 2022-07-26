import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserIdQueryKey = 'user-id';

export const QueryUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request[UserIdQueryKey];
  },
);
