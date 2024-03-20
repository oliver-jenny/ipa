import { http, HttpResponse } from 'msw';
import { registrationMock } from './registrationTestdata';

export const getRegistrationMetasMock = http.post(
  'http://localhost:9000/registrations/',
  async ({ request }) => {
    const { limit } = (await request.json()) as {
      limit: number;
    };

    if (limit === 0) {
      return HttpResponse.json({ data: [], totalResults: 0 }, { status: 200 });
    }

    return HttpResponse.json(
      { data: ['someId'], totalResults: 1 },
      { status: 200 },
    );
  },
);

export const getRegistrationMock = http.get(
  `http://localhost:9000/registrations/**`,
  () => {
    return HttpResponse.json(registrationMock, { status: 200 });
  },
);

export const acceptRegistrationOkMock = http.put(
  `http://localhost:9000/registrations/**/accept`,
  () => {
    return new HttpResponse(null, {
      status: 204,
    });
  },
);

export const acceptRegistrationNokMock = http.put(
  `http://localhost:9000/registrations/**/accept`,
  () => {
    return new HttpResponse(null, {
      status: 404,
    });
  },
);

export const rejectRegistrationOkMock = http.put(
  `http://localhost:9000/registrations/**/reject`,
  () => {
    return new HttpResponse(null, {
      status: 204,
    });
  },
);

export const rejectRegistrationNokMock = http.put(
  `http://localhost:9000/registrations/**/reject`,
  () => {
    return new HttpResponse(null, {
      status: 404,
    });
  },
);

export const handlers = [
  getRegistrationMetasMock,
  getRegistrationMock,
  acceptRegistrationOkMock,
  acceptRegistrationNokMock,
  rejectRegistrationOkMock,
  rejectRegistrationNokMock,
];
