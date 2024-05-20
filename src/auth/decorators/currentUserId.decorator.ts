import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {JwtPayload} from '../types';
import {GqlExecutionContext} from '@nestjs/graphql';

export const CurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const user = req.user as JwtPayload;
    return user.userId;
  },
);
