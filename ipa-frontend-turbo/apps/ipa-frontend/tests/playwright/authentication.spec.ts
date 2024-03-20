import { test, expect } from '@playwright/test';

test('User login happy-flow', async ({ page }) => {
  // Mocking the login fetch request
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
    });
  });

  await page.goto('http://localhost:5173/auth');

  // Fill and submit the form
  await page.fill('#username', 'your_username');
  await page.fill('#password', 'your_password');
  await page.getByTitle('submit').click();

  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.waitForURL('http://localhost:5173/');

  const mainPage = await page.textContent('div:visible', { timeout: 5000 });
  expect(mainPage).toContain('Suchen');
});

test('User login is authenticated', async ({ page }) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.goto('http://localhost:5173/auth');

  await page.waitForURL('http://localhost:5173/');

  const mainPage = await page.textContent('div:visible', { timeout: 5000 });
  expect(mainPage).toContain('Suchen');
});

test('User login has cookies but unauthenticated', async ({ page }) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: false }),
    });
  });

  // Mocking the login fetch request
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
    });
  });

  await page.goto('http://localhost:5173/auth');

  // Fill and submit the form
  await page.fill('#username', 'your_username');
  await page.fill('#password', 'your_password');
  await page.getByTitle('submit').click();

  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.waitForURL('http://localhost:5173/');

  const mainPage = await page.textContent('div:visible', { timeout: 5000 });
  expect(mainPage).toContain('Suchen');
});

test('User login with wrong credentials', async ({ page }) => {
  // Mocking the login fetch request
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 401,
    });
  });

  await page.goto('http://localhost:5173/auth');

  // Fill and submit the form
  await page.fill('#username', 'your_username');
  await page.fill('#password', 'your_password');
  await page.getByTitle('submit').click();

  await page.waitForURL('http://localhost:5173/auth');

  const authenticateText = await page.textContent('h1:visible', {
    timeout: 5000,
  });
  expect(authenticateText).toContain('Authentifizierung');
});

test('User Logout successful', async ({ page }) => {
  // Mocking the login fetch request
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
    });
  });

  await page.goto('http://localhost:5173/auth');

  // Fill and submit the form
  await page.fill('#username', 'your_username');
  await page.fill('#password', 'your_password');
  await page.getByTitle('submit').click();

  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.waitForURL('http://localhost:5173');

  await page.getByTitle('logout').click();

  page.route('**/auth/logout', (route) => {
    route.fulfill();
  });

  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: false }),
    });
  });

  await page.waitForURL('http://localhost:5173/auth');

  const authenticateText = await page.textContent('h1:visible', {
    timeout: 5000,
  });
  expect(authenticateText).toContain('Authentifizierung');
});
