import { MongoClient } from 'mongodb';
import { config } from './config';

export const client = new MongoClient(config.mongoUri);

export const db = client.db('ipa-switch-api');
