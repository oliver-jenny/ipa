import Router from '@koa/router';
import { router as helloWorldRouter } from './hello-world/routes';
import { router as authRouter } from './authentication/routes';
import { router as registrationsRouter } from './registrations/routes';

export const router = new Router();

router.use(helloWorldRouter.routes()).use(helloWorldRouter.allowedMethods());

router.use(authRouter.routes()).use(authRouter.allowedMethods());

router.use(registrationsRouter.routes()).use(registrationsRouter.routes());
