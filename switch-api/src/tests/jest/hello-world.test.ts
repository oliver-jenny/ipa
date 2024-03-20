import request from 'supertest';
import type { Collection } from 'mongodb';
import { app } from '../../app';
import { db, client } from '../../mongo';

describe('Hello world tests', () => {
  let collection: Collection;

  beforeAll(() => {
    collection = db.collection('helloWorld');
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await collection.insertOne({ value: '' });
    await collection.drop();
    await collection.insertOne({ value: 'Hello 🌏!' });
  });

  test('Get hello world empty db', async () => {
    await collection.drop();
    const response = await request(app.callback()).get('/hello-world/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('');
  });

  test('Get hello world', async () => {
    const response = await request(app.callback()).get('/hello-world/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello 🌏!');
  });
});
