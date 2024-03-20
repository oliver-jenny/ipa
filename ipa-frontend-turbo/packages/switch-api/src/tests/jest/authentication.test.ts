import { setupServer } from 'msw/node';
import {
  isAuthenticatedMock,
  isntAuthenticatedMock,
  loginMock,
  handlers,
} from '../msw/authentication.mock';
import { isAuthenticated, login } from '../../authentication';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Test authentication api calls', () => {
  it('should return 200 when authentication is successful', async () => {
    server.use(loginMock);
    const response = await login('valid', 'valid');

    if (response) {
      expect(response.status).toBe(200);
    }
  });

  it('should return 401 when authentication is not successful', async () => {
    server.use(loginMock);
    const response = await login('invalid', 'invalid');

    if (response) {
      expect(response.status).toBe(401);
    }
  });

  it('should return true when user isAuthenticated', async () => {
    server.use(isAuthenticatedMock);
    const response = await isAuthenticated();

    if (response) {
      expect(response).toBe(true);
    }
  });

  it('should return true when user isAuthenticated', async () => {
    server.use(isntAuthenticatedMock);
    const response = await isAuthenticated();

    if (response) {
      expect(response).toBe(false);
    }
  });
});
