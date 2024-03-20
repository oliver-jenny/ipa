import { http, HttpResponse } from 'msw';

// Mock with status 200 - OK
export const getHelloWorld200 = http.get(
  'http://localhost:9000/hello-world',
  () => {
    return HttpResponse.text('Hello 🌏!', { status: 200 });
  },
);

// Mock with status 204 - No-Content
export const getHelloWorld204 = http.get(
  'http://localhost:9000/hello-world',
  () => {
    return new HttpResponse(null, {
      status: 204,
      statusText: 'No-Content',
    });
  },
);

export const handlers = [getHelloWorld204, getHelloWorld200];
