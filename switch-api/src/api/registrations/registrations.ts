import type { ParameterizedContext } from 'koa';
import type { IdPathParam, RegistrationMetaRequest } from './types';
import { ProcessingState } from './types';
import {
  accept,
  findOneRegistration,
  findOneRegistrationFiltered,
  findOneRegistrationMeta,
  findRegistrationMetas,
  reject,
  totalCountForUser,
} from './registrations.service';
import type { User } from '../authentication/authentication';

export const getRegistrationMeta = async (ctx: ParameterizedContext) => {
  const options = ctx.request.body as RegistrationMetaRequest;
  const { user } = ctx.state;

  if (
    options.processingState &&
    !(
      options.processingState === ProcessingState.OPEN ||
      options.processingState === ProcessingState.REJECTED ||
      options.processingState === ProcessingState.ACCEPTED
    )
  ) {
    ctx.status = 400;
  } else {
    ctx.body = {
      data: await findRegistrationMetas(options),
      totalResults: await totalCountForUser(
        options.processingState,
        user as User,
      ),
    };
  }
};

export const getRegistrationDetails = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params as IdPathParam;
  const { user } = ctx.state;

  const registration = await findOneRegistrationFiltered({ id }, user as User);

  if (!registration) {
    ctx.status = 404;
  } else {
    ctx.status = 200;
    ctx.body = registration.family.partner.length > 0 ? registration : {};
  }
};

export const acceptRegistration = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params as IdPathParam;

  const registrationMeta = await findOneRegistrationMeta({ id });
  const registration = await findOneRegistration({ id });

  if (!registrationMeta || !registration) {
    ctx.status = 404;
  } else if (
    registrationMeta.state !== ProcessingState.OPEN ||
    registration.state !== ProcessingState.OPEN
  ) {
    ctx.status = 400;
  } else {
    ctx.status = 204;
    accept({ id });
  }
};

export const rejectRegistration = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params as IdPathParam;
  const { reason } = ctx.request.body as { reason: string };

  const registrationMeta = await findOneRegistrationMeta({ id });
  const registration = await findOneRegistration({ id });

  if (!registrationMeta || !registration) {
    ctx.status = 404;
  } else if (
    registrationMeta.state !== ProcessingState.OPEN ||
    registration.state !== ProcessingState.OPEN
  ) {
    ctx.status = 400;
  } else {
    ctx.status = 204;
    reject({ id }, reason);
  }
};
