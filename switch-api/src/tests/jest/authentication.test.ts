import request from 'supertest';
import type { Collection } from 'mongodb';
import bcrypt from 'bcrypt';
import { app } from '../../app';
import { db, client } from '../../mongo';
import { findUser } from '../../api/authentication/authentication.service';

describe('Authentication tests', () => {
  let collection: Collection;

  beforeAll(() => {
    collection = db.collection('users');
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await collection.insertOne({ username: '', password: '' });
    await collection.drop();
    await collection.insertOne({
      username: 'Test Insurer',
      password: await bcrypt.hash('Test Insurer', 10),
    });
  });

  it('can find inserted user', async () => {
    const username = 'Test Insurer';
    await findUser({ username }).then((res) => {
      expect(res.username).toBe(username);
    });
  });

  it('log into user successfully', async () => {
    await request(app.callback())
      .post('/auth/')
      .send({ username: 'Test Insurer', password: 'Test Insurer' })
      .then(async (response) => {
        expect(response.headers['set-cookie']).toBeDefined();

        const cookies = response.headers['set-cookie'];

        await request(app.callback())
          .get('/auth/')
          .set('Cookie', cookies)
          .then((res) => {
            expect(res.body).toStrictEqual({ isAuthenticated: true });
          });
      });
  });

  it('failes to log in if user does not exist', async () => {
    await request(app.callback())
      .post('/auth/')
      .send({
        username: 'This insurer does not exist',
        password: 'This insurer does not exist',
      })
      .then((response) => {
        expect(response.headers['set-cookie']).toBeUndefined();
      });
  });

  it('failes to log in if password is wrong', async () => {
    await request(app.callback())
      .post('/auth/')
      .send({
        username: 'Test Insurer',
        password: 'This password is incorrect',
      })
      .then((response) => {
        expect(response.headers['set-cookie']).toBeUndefined();
      });
  });

  it('logs out the user successfully', async () => {
    await request(app.callback())
      .post('/auth/')
      .send({ username: 'Test Insurer', password: 'Test Insurer' })
      .then(async (response) => {
        expect(response.headers['set-cookie']).toBeDefined();

        const cookies = response.headers['set-cookie'];

        await request(app.callback())
          .get('/auth/')
          .set('Cookie', cookies)
          .then((res) => {
            expect(res.body).toStrictEqual({ isAuthenticated: true });
          });
      });

    await request(app.callback())
      .post('/auth/logout')
      .then(async () => {
        await request(app.callback())
          .get('/auth/')
          .then((response) => {
            expect(response.body).toStrictEqual({ isAuthenticated: false });
          });
      });
  });
});
