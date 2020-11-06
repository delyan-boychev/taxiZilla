import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Resp = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getResponse();
      return request;
    },
  );