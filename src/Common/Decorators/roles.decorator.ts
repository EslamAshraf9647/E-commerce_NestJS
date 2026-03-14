// import { Reflector } from "@nestjs/core";
// export const Roles = Reflector.createDecorator<string[]>()

import {createParamDecorator,ExecutionContext,SetMetadata,} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
export const Roles = (...roles: string[]) => SetMetadata('Roles', roles);

export const Authuser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    let req = ctx.switchToHttp().getRequest();
    if (ctx['contextType'] == 'graphql') req = GqlExecutionContext.create(ctx).getContext()
    return req.authUser;
  },
);
