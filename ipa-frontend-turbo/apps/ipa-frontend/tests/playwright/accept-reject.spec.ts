import { expect, test } from '@playwright/test';
import { registration01 } from './registration.mock';

test('Accept registration happy flow', async ({ page }) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.goto('http://localhost:5173/');

  await page.waitForURL('http://localhost:5173/');

  await page.route('**/registrations/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [{ id: 'registrationId' }],
        totalResults: 1,
      }),
    });
  });

  await page.route('**/registrations/registrationId', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(registration01),
    });
  });

  await page.getByTitle('search-button').click();

  await page.locator('#check-icon').click();

  await page.route('**/registrations/**/accept/', (route) => {
    route.fulfill({
      status: 200,
    });
  });

  await page.getByTitle('accept-action-button').click();
});

test('Accept registration with Filter', async ({ page }) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.goto('http://localhost:5173/');

  await page.waitForURL('http://localhost:5173/');

  await page.route('**/registrations/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [{ id: 'registrationId' }],
        totalResults: 1,
      }),
    });
  });

  await page.getByTitle('processingState-filter').click();
  await page.getByTitle('processingState-filter-open').click();

  await page.route('**/registrations/registrationId', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(registration01),
    });
  });

  await page.getByTitle('search-button').click();

  await page.locator('#check-icon').click();

  await page.route('**/registrations/**/accept/', (route) => {
    route.fulfill({
      status: 200,
    });
  });

  await page.route('**/registrations/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [],
        totalResults: 0,
      }),
    });
  });

  await page.getByTitle('accept-action-button').click();
  await page.getByTitle('search-button').click();

  const mainPage = await page.textContent('div:visible', { timeout: 5000 });
  expect(mainPage).toContain(
    'Es wurden keine Anmeldungen für Sie gefunden. Falls dies ein Fehler sein sollte, melden Sie sich beim Support unter +41 xx xxx xx xx oder versuchen Sie Daten mithilfe des SUCHEN-Knopfs zu laden',
  );
});

test('Accept registration cancel', async ({ page }) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.goto('http://localhost:5173/');

  await page.waitForURL('http://localhost:5173/');

  await page.route('**/registrations/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [{ id: 'registrationId' }],
        totalResults: 1,
      }),
    });
  });

  await page.route('**/registrations/registrationId', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(registration01),
    });
  });

  await page.getByTitle('search-button').click();

  await page.locator('#check-icon').click();

  await page.getByTitle('cancel-action-button').click();

  const mainPage = await page.textContent('table:visible', { timeout: 5000 });
  expect(mainPage).toContain(registration01.family.contactPerson.firstName);
});

test('Reject registration happy flow', async ({ page }) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.goto('http://localhost:5173/');

  await page.waitForURL('http://localhost:5173/');

  await page.route('**/registrations/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [{ id: 'registrationId' }],
        totalResults: 1,
      }),
    });
  });

  await page.route('**/registrations/registrationId', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(registration01),
    });
  });

  await page.getByTitle('search-button').click();

  await page.locator('#cross-icon').click();

  await page.route('**/registrations/**/accept/', (route) => {
    route.fulfill({
      status: 200,
    });
  });

  await page.fill('#reason', 'good_reason');

  await page.getByTitle('accept-action-button').click();
});

test('Reject without reason', async ({ page }) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.goto('http://localhost:5173/');

  await page.waitForURL('http://localhost:5173/');

  await page.route('**/registrations/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [{ id: 'registrationId' }],
        totalResults: 1,
      }),
    });
  });

  await page.getByTitle('processingState-filter').click();
  await page.getByTitle('processingState-filter-open').click();

  await page.route('**/registrations/registrationId', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(registration01),
    });
  });

  await page.getByTitle('search-button').click();

  await page.locator('#cross-icon').click();
  await page.getByTitle('accept-action-button').click();

  expect(
    page.getByText(
      'Um eine Anmeldung zurückzuweisen müssen Sie einen Grund für die Zurückweisung angeben.',
    ),
  ).toBeDefined();
});

test('Reject registration with Filter', async ({ page }) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.goto('http://localhost:5173/');

  await page.waitForURL('http://localhost:5173/');

  await page.route('**/registrations/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [{ id: 'registrationId' }],
        totalResults: 1,
      }),
    });
  });

  await page.getByTitle('processingState-filter').click();
  await page.getByTitle('processingState-filter-open').click();

  await page.route('**/registrations/registrationId', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(registration01),
    });
  });

  await page.getByTitle('search-button').click();

  await page.locator('#cross-icon').click();

  await page.route('**/registrations/**/accept/', (route) => {
    route.fulfill({
      status: 200,
    });
  });

  await page.route('**/registrations/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [],
        totalResults: 0,
      }),
    });
  });

  await page.fill('#reason', 'good_reason');
  await page.getByTitle('accept-action-button').click();
  await page.getByTitle('search-button').click();

  const mainPage = await page.textContent('div:visible', { timeout: 5000 });
  expect(mainPage).toContain(
    'Es wurden keine Anmeldungen für Sie gefunden. Falls dies ein Fehler sein sollte, melden Sie sich beim Support unter +41 xx xxx xx xx oder versuchen Sie Daten mithilfe des SUCHEN-Knopfs zu laden',
  );
});

test('Reject registration cancel', async ({ page }) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.goto('http://localhost:5173/');

  await page.waitForURL('http://localhost:5173/');

  await page.route('**/registrations/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [{ id: 'registrationId' }],
        totalResults: 1,
      }),
    });
  });

  await page.route('**/registrations/registrationId', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(registration01),
    });
  });

  await page.getByTitle('search-button').click();

  await page.locator('#cross-icon').click();

  await page.getByTitle('cancel-action-button').click();

  const mainPage = await page.textContent('table:visible', { timeout: 5000 });
  expect(mainPage).toContain(registration01.family.contactPerson.firstName);
});
