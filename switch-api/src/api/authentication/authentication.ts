import { type ParameterizedContext } from 'koa';
import type { ObjectId } from 'mongodb';

export type User = {
  _id: ObjectId;
  username: string;
  password: string;
  insurers: Array<string>;
};

export const logout = async (ctx: ParameterizedContext) => {
  await ctx.logout();
};

export const validateSession = (ctx: ParameterizedContext) => {
  const isAuthenticated = ctx.isAuthenticated();
  ctx.body = { isAuthenticated };
};
