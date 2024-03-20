import { setupServer } from 'msw/node';
import {
  acceptRegistrationNokMock,
  acceptRegistrationOkMock,
  getRegistrationMetasMock,
  getRegistrationMock,
  handlers,
  rejectRegistrationNokMock,
  rejectRegistrationOkMock,
} from '../msw/registrations.mock';
import {
  acceptRegistration,
  getRegistrations,
  ProcessingState,
  rejectRegistration,
} from '../../registrations';
import { registrationMock } from '../msw/registrationTestdata';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Test registration api calls', () => {
  it('should return [] when no results are found', async () => {
    server.use(getRegistrationMetasMock);
    const response = await getRegistrations(ProcessingState.OPEN, 0, 0);

    if (response) {
      expect(response.registrations).toStrictEqual([]);
    }
  });

  it('should return registrations when some are found', async () => {
    server.use(getRegistrationMetasMock);
    server.use(getRegistrationMock);
    const response = await getRegistrations(ProcessingState.OPEN, 0, 1);

    if (response) {
      expect(response.registrations).toEqual([registrationMock]);
    }
  });

  it('return true if accept is successful', async () => {
    server.use(acceptRegistrationOkMock);
    const response = await acceptRegistration('someId');

    if (response) {
      expect(response).toStrictEqual(true);
    }
  });

  it("return false if accept isn't successful", async () => {
    server.use(acceptRegistrationNokMock);
    const response = await acceptRegistration('someId');

    if (response) {
      expect(response).toStrictEqual(false);
    }
  });

  it('return true if accept is successful', async () => {
    server.use(rejectRegistrationOkMock);
    const response = await rejectRegistration('someId', 'someReason');

    if (response) {
      expect(response).toStrictEqual(true);
    }
  });

  it("return false if rejection isn't successful", async () => {
    server.use(rejectRegistrationNokMock);
    const response = await rejectRegistration('someId', 'someReason');

    if (response) {
      expect(response).toStrictEqual(false);
    }
  });
});
