import type { Collection, Filter } from 'mongodb';
import { db } from '../../mongo';
import type {
  Registration,
  RegistrationMeta,
  RegistrationMetaRequest,
} from './types';
import { ProcessingState } from './types';
import { log } from '../../log';
import type { User } from '../authentication/authentication';

const registrationMetaCollection = (): Collection<RegistrationMeta> => {
  return db.collection('registrationMeta');
};

const registrationCollection = (): Collection<Registration> => {
  return db.collection('registration');
};

export const findRegistrationMetas = (
  options: Partial<Filter<RegistrationMetaRequest>> = {},
) => {
  const { processingState = null, offset = 0, limit = 10 } = options;

  const match = processingState
    ? { $match: { state: processingState } }
    : { $match: { state: { $regex: /.*/ } } };

  return registrationMetaCollection()
    .aggregate([
      match,
      { $skip: offset },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          id: 1,
        },
      },
    ])
    .toArray();
};

export const findOneRegistrationMeta = (find: Filter<RegistrationMeta>) => {
  const collection = registrationMetaCollection();
  return collection.findOne(find);
};

export const totalCountForUser = async (
  state: ProcessingState,
  user: User,
): Promise<number> => {
  const match = state
    ? { $match: { state } }
    : { $match: { state: { $regex: /.*/ } } };

  const registration = await registrationCollection()
    .aggregate<Registration>([
      match,
      {
        $project: {
          'family.partner': {
            $filter: {
              input: '$family.partner',
              as: 'partner',
              cond: {
                $in: [
                  '$$partner.insuranceConfiguration.insurer.name',
                  user.insurers,
                ],
              },
            },
          },
        },
      },
    ])
    .toArray();

  return registration.filter((r) => r.family.partner.length > 0).length;
};

export const findOneRegistrationFiltered = async (
  find: Filter<Registration>,
  user: User,
): Promise<Registration | null> => {
  const registration = await registrationCollection()
    .aggregate<Registration>([
      { $match: find },
      {
        $project: {
          _id: 0,
          id: 1,
          reason: 1,
          state: 1,
          dateCreated: 1,
          family: {
            address: 1,
            contactPerson: 1,
            paymentInfo: 1,
            partner: {
              $filter: {
                input: '$family.partner',
                as: 'partner',
                cond: {
                  $in: [
                    '$$partner.insuranceConfiguration.insurer.name',
                    user.insurers,
                  ],
                },
              },
            },
          },
        },
      },
    ])
    .toArray();

  return registration.at(0);
};

export const findOneRegistration = (find: Filter<Registration>) => {
  const collection = registrationCollection();
  return collection.findOne(find);
};

export const accept = (find: Filter<RegistrationMeta & Registration>) => {
  const metaCollection = registrationMetaCollection();
  metaCollection
    .updateOne(find, { $set: { state: ProcessingState.ACCEPTED } })
    .catch((error) =>
      log.error(
        `Something went wrong while setting registration metadata with id: ${String(find.id)} to accepted - ${error}`,
      ),
    );

  const collection = registrationCollection();
  collection
    .updateOne(find, { $set: { state: ProcessingState.ACCEPTED } })
    .catch((error) =>
      log.error(
        `Something went wrong while setting registration with id: ${String(find.id)} to accepted - ${error}`,
      ),
    );
};

export const reject = (
  find: Filter<RegistrationMeta & Registration>,
  reason: string,
) => {
  const metaCollection = registrationMetaCollection();
  metaCollection
    .updateOne(find, { $set: { state: ProcessingState.REJECTED } })
    .catch((error) =>
      log.error(
        `Something went wrong while setting registration metadata with id: ${String(find.id)} to rejected - ${error}`,
      ),
    );

  const collection = registrationCollection();
  collection
    .updateOne(find, { $set: { state: ProcessingState.REJECTED, reason } })
    .catch((error) =>
      log.error(
        `Something went wrong while setting registration with id: ${String(find.id)} to rejected - ${error}`,
      ),
    );
};
