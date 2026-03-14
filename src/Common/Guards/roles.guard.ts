import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const allowedRoles = this.reflector.get('Roles', context.getHandler());

    let request = context.switchToHttp().getRequest();
    if (context['contextType'] == 'graphql') request = GqlExecutionContext.create(context).getContext()
    const userRole = request['authUser'].user.role;
    // console.log({ allowedRoles, userRole });

    return allowedRoles.includes(userRole);
  }
}
