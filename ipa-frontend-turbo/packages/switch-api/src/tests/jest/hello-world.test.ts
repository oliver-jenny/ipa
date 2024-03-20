import { setupServer } from 'msw/node';
import {
  getHelloWorld200,
  getHelloWorld204,
  handlers,
} from '../msw/hello-world.mock';
import { getHelloWorld } from '../../hello-world';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// TODO: call hello-world.ts
//  Test error case with throw etc..
describe('Test hello world api calls', () => {
  it('should return hello message when API call is successful', async () => {
    server.use(getHelloWorld200);
    const response = await getHelloWorld();

    expect(response).toBeDefined;

    if (response) {
      expect(response.status).toBe(200);
      expect(response.data).toBe('Hello 🌏!');
    }
  });

  it('should return no content when API call is successful but with no data', async () => {
    server.use(getHelloWorld204);
    const response = await getHelloWorld();
    if (response) {
      expect(response.status).toBe(204);
      expect(response.data).toBe('');
    }
  });
});
