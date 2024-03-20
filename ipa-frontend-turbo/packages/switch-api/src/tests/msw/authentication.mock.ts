import { http, HttpResponse, JsonBodyType } from 'msw';

export const loginMock = http.post(
  'http://localhost:9000/auth',
  async ({ request }) => {
    const { username, password } = (await request.json()) as {
      username: string;
      password: string;
    };

    if (username === 'valid' && password === 'valid') {
      return HttpResponse.text(null, { status: 200 });
    } else {
      return new HttpResponse(null, {
        status: 401,
      });
    }
  },
);

export const isAuthenticatedMock = http.get(
  'http://localhost:9000/auth',
  ({ request }) => {
    return HttpResponse.json({ isAuthenticated: true }, { status: 200 });
  },
);

export const isntAuthenticatedMock = http.get(
  'http://localhost:9000/auth',
  ({ request }) => {
    return HttpResponse.json({ isAuthenticated: false }, { status: 200 });
  },
);

export const handlers = [loginMock, isAuthenticatedMock, isntAuthenticatedMock];
