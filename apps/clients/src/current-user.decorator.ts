import { createParamDecorator } from '@nestjs/common';
import { GraphQLExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: GraphQLExecutionContext) => {
    try {
      const headers = ctx.getContext().req.headers;

      if (headers.user) {
        return JSON.parse(headers.user);
      }
    } catch (err) {
      return null;
    }
  },
);
