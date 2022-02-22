import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from './types';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    const { id, email, iat } = req.user;
    return {
      id,
      email,
      iat,
    };
  },
);
