import { createParamDecorator } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { User } from "./user.entity";

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext): User => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  }
);
