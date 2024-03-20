import Router from '@koa/router';
import {
  acceptRegistration,
  getRegistrationDetails,
  getRegistrationMeta,
  rejectRegistration,
} from './registrations';

export const router = new Router({ prefix: '/registrations' });

router.post('/', (ctx) => getRegistrationMeta(ctx));
router.get('/:id', (ctx) => getRegistrationDetails(ctx));
router.put('/:id/accept', (ctx) => acceptRegistration(ctx));
router.put('/:id/reject', (ctx) => rejectRegistration(ctx));
