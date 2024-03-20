import Router from '@koa/router';
import passport from 'koa-passport';
import { logout, validateSession } from './authentication';

export const router = new Router({ prefix: '/auth' });

router.post('/', passport.authenticate('local'), (ctx) => {
  ctx.status = ctx.isAuthenticated ? 200 : 401;
});

router.get('/logout', (ctx) => logout(ctx));

router.get('/', (ctx) => validateSession(ctx));
