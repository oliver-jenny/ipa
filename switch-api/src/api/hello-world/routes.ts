import Router from '@koa/router';
import { getHelloWorld } from './hello-world';

export const router = new Router({ prefix: '/hello-world' });

router.get(`/`, (ctx) => getHelloWorld(ctx));
