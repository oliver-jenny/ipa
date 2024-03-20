import { parseStringFromEnv } from '@axah/env-utils';

export const config = {
  port: 6000,
  mongoUri: parseStringFromEnv('MONGO_URI', 'mongodb://localhost:27017'),
};

export type Config = typeof config;
