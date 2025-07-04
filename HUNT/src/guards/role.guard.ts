import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const req: Request | any = context.switchToHttp().getRequest();
    const userRoles = req.tokenPayload?.role;

    const roles = Array.isArray(userRoles) ? userRoles : [userRoles];

    return requiredRoles.some((role) => roles.includes(role));
  }
}
