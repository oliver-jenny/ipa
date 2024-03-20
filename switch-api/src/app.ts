import Koa from 'koa';
import cors from '@koa/cors';
import passport from 'koa-passport';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import { router } from './api/routes';
import { authenticationMiddleware } from './api/authentication/middleware';

export const app = new Koa();
// TODO
app.keys = ['This should be an env var so its secure'];
app.use(
  session(
    {
      // should be set on prod
      /* secure: true, */
      /* sameSite: 'none' */
    },
    app,
  ),
);

app.use(bodyParser());
app.use(cors({ origin: '*', credentials: true }));

authenticationMiddleware();
app.use(passport.initialize());
app.use(passport.session());

const unauthenticatedRoutes = ['/auth/', '/auth/logout'];

app.use(async (ctx, next) => {
  if (unauthenticatedRoutes.includes(ctx.path)) {
    await next();
  } else if (ctx.isAuthenticated()) {
    await next();
  } else {
    ctx.status = 401;
    ctx.body = { error: 'Authentication required' };
  }
});

app.use(router.routes()).use(router.allowedMethods());
