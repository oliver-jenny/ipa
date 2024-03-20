import type { Collection } from 'mongodb';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { client, db } from '../../mongo';
import { app } from '../../app';
import {
  registrationOpen,
  registrationMetaOpen,
  registrationMetaAccepted,
  registrationMetaRejected,
  registrationAccepted,
  registrationRejected,
} from './registration.mock';

describe('Registration tests', () => {
  let registrationMetaCollection: Collection;
  let registrationCollection: Collection;
  let cookies = '';

  beforeAll(() => {
    registrationMetaCollection = db.collection('registrationMeta');
    registrationCollection = db.collection('registration');
  });

  afterAll(async () => {
    await client.close();
  });

  const { family } = registrationOpen;
  const { id, dateCreated, state } = registrationMetaOpen;

  beforeEach(async () => {
    await registrationMetaCollection.insertOne({ value: '' });
    await registrationMetaCollection.drop();
    await registrationMetaCollection.insertOne(registrationMetaOpen);

    await registrationCollection.insertOne({ value: '' });
    await registrationCollection.drop();
    await registrationCollection.insertOne(registrationOpen);

    // Authenticate a User for tests
    const userCollection = db.collection('users');
    await userCollection.insertOne({
      username: 'Test Insurer',
      password: await bcrypt.hash('Test Insurer', 10),
      insurers: ['Sanitas', 'KPT'],
    });

    await request(app.callback())
      .post('/auth/')
      .send({ username: 'Test Insurer', password: 'Test Insurer' })
      .then((response) => {
        cookies = response.headers['set-cookie'];
      });
  });

  it('can get registration metadata', async () => {
    await request(app.callback())
      .post('/registrations/')
      .set('Cookie', cookies)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({
          data: [{ id }],
          totalResults: 1,
        });
      });
  });

  it('returns code 400 if processing state is invalid', async () => {
    await request(app.callback())
      .post('/registrations/')
      .set('Cookie', cookies)
      .send({ processingState: 'INVALID_STATE' })
      .then((response) => {
        expect(response.status).toBe(400);
      });
  });

  it('finds registration details with its id', async () => {
    await request(app.callback())
      .get(`/registrations/${id}/`)
      .set('Cookie', cookies)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({
          id,
          dateCreated,
          state,
          family,
        });
      });
  });

  it('find registration with invalid id returns 404', async () => {
    await request(app.callback())
      .get(`/registrations/thisiddoesnotexist/`)
      .set('Cookie', cookies)
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });

  it('returns 401 if the user is not authenticated', async () => {
    await request(app.callback())
      .get('/registrations/')
      .then((response) => {
        expect(response.status).toBe(401);
      });

    await request(app.callback())
      .get(`/registrations/${id}/`)
      .then((response) => {
        expect(response.status).toBe(401);
      });
  });
});

describe('Accept registration tests', () => {
  let registrationMetaCollection: Collection;
  let registrationCollection: Collection;
  let cookies = '';

  beforeAll(() => {
    registrationMetaCollection = db.collection('registrationMeta');
    registrationCollection = db.collection('registration');
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await registrationMetaCollection.insertOne({ value: '' });
    await registrationMetaCollection.drop();
    await registrationMetaCollection.insertMany([
      registrationMetaOpen,
      registrationMetaAccepted,
      registrationMetaRejected,
    ]);

    await registrationCollection.insertOne({ value: '' });
    await registrationCollection.drop();
    await registrationCollection.insertMany([
      registrationOpen,
      registrationAccepted,
      registrationRejected,
    ]);

    const userCollection = db.collection('users');
    await userCollection.insertOne({
      username: 'Test Insurer',
      password: await bcrypt.hash('Test Insurer', 10),
      insurers: ['Sanitas', 'KPT'],
    });

    await request(app.callback())
      .post('/auth/')
      .send({ username: 'Test Insurer', password: 'Test Insurer' })
      .then((response) => {
        cookies = response.headers['set-cookie'];
      });
  });

  it('returns 200 when everything is ok', async () => {
    await request(app.callback())
      .put(`/registrations/${registrationOpen.id}/accept`)
      .set('Cookie', cookies)
      .then((response) => expect(response.status).toBe(204));
  });

  it('returns 400 when its already rejected', async () => {
    await request(app.callback())
      .put(`/registrations/${registrationRejected.id}/accept`)
      .set('Cookie', cookies)
      .then((response) => expect(response.status).toBe(400));
  });

  it('returns 404 when its not found', async () => {
    await request(app.callback())
      .put(`/registrations/not-existent-id/accept`)
      .set('Cookie', cookies)
      .then((response) => expect(response.status).toBe(404));
  });
});

describe('Reject registration tests', () => {
  let registrationMetaCollection: Collection;
  let registrationCollection: Collection;
  let cookies = '';

  beforeAll(() => {
    registrationMetaCollection = db.collection('registrationMeta');
    registrationCollection = db.collection('registration');
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await registrationMetaCollection.insertOne({ value: '' });
    await registrationMetaCollection.drop();
    await registrationMetaCollection.insertMany([
      registrationMetaOpen,
      registrationMetaAccepted,
      registrationMetaRejected,
    ]);

    await registrationCollection.insertOne({ value: '' });
    await registrationCollection.drop();
    await registrationCollection.insertMany([
      registrationOpen,
      registrationAccepted,
      registrationRejected,
    ]);

    const userCollection = db.collection('users');
    await userCollection.insertOne({
      username: 'Test Insurer',
      password: await bcrypt.hash('Test Insurer', 10),
      insurers: ['Sanitas', 'KPT'],
    });

    await request(app.callback())
      .post('/auth/')
      .send({ username: 'Test Insurer', password: 'Test Insurer' })
      .then((response) => {
        cookies = response.headers['set-cookie'];
      });
  });

  it('returns 200 when everything is ok', async () => {
    await request(app.callback())
      .put(`/registrations/${registrationOpen.id}/reject`)
      .set('Cookie', cookies)
      .then((response) => expect(response.status).toBe(204));
  });

  it('returns 400 when its already accepted', async () => {
    await request(app.callback())
      .put(`/registrations/${registrationRejected.id}/reject`)
      .set('Cookie', cookies)
      .then((response) => expect(response.status).toBe(400));
  });

  it('returns 404 when its not found', async () => {
    await request(app.callback())
      .put(`/registrations/not-existent-id/reject`)
      .set('Cookie', cookies)
      .then((response) => expect(response.status).toBe(404));
  });
});
