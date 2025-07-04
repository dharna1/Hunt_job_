import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.log(data ? user?.[data] : user, 'abcd');
    return data ? user?.[data] : user;
  },
);
