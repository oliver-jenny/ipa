import type Application from 'koa';
import { findOneHelloWorld } from './hello-world.service';

export const getHelloWorld = async (ctx: Application.ParameterizedContext) => {
  const data = await findOneHelloWorld();
  ctx.body = data?.value ?? '';
};
