import { test, expect } from '@playwright/test';
import {
  registration01,
  registration02,
  registration03,
} from './registration.mock';

test('Load registrations happy flow', async ({ page }) => {
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

  const mainPage = await page.textContent('table:visible', { timeout: 5000 });
  expect(mainPage).toContain(registration01.family.contactPerson.firstName);
});

test('Load registrations happy flow with filter', async ({ page }) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.goto('http://localhost:5173/');

  await page.waitForURL('http://localhost:5173/');

  await page.getByTitle('processingState-filter').click();
  await page.getByTitle('processingState-filter-rejected').click();

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
      body: JSON.stringify(registration02),
    });
  });

  await page.getByTitle('search-button').click();

  const mainPage = await page.textContent('table:visible', { timeout: 5000 });
  expect(mainPage).toContain(registration02.family.contactPerson.firstName);
});

test('Load registrations no registrations found', async ({ page }) => {
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
        data: [],
        totalResults: 0,
      }),
    });
  });

  await page.getByTitle('search-button').click();

  const mainPage = await page.textContent('div:visible', { timeout: 5000 });
  expect(mainPage).toContain(
    'Es wurden keine Anmeldungen für Sie gefunden. Falls dies ein Fehler sein sollte, melden Sie sich beim Support unter +41 xx xxx xx xx oder versuchen Sie Daten mithilfe des SUCHEN-Knopfs zu laden',
  );
});

test('Load registrations no registrations found with filters set', async ({
  page,
}) => {
  await page.route('**/auth/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isAuthenticated: true }),
    });
  });

  await page.goto('http://localhost:5173/');

  await page.waitForURL('http://localhost:5173/');

  await page.getByTitle('processingState-filter').click();
  await page.getByTitle('processingState-filter-rejected').click();

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

  await page.getByTitle('search-button').click();

  const mainPage = await page.textContent('div:visible', { timeout: 5000 });
  expect(mainPage).toContain(
    'Es wurden keine Anmeldungen für Sie gefunden. Falls dies ein Fehler sein sollte, melden Sie sich beim Support unter +41 xx xxx xx xx oder versuchen Sie Daten mithilfe des SUCHEN-Knopfs zu laden',
  );
});
