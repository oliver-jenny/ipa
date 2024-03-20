import type { Collection, Filter } from 'mongodb';
import { db } from '../../mongo';
import type { User } from './authentication';

const usersCollection = (): Collection<User> => {
  return db.collection('users');
};

export const findUser = (find: Filter<User>) => {
  const collection = usersCollection();
  return collection.findOne(find);
};
