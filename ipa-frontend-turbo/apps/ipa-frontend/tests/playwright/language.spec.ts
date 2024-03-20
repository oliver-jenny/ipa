import { expect, test } from '@playwright/test';
import { registration01 } from './registration.mock';

test('Language DE -> EN', async ({ page }) => {
  await page.goto('http://localhost:5173/auth');

  await page.getByText('DE', { exact: true }).click();

  const authenticateTextDe = await page.textContent('h1:visible', {
    timeout: 5000,
  });
  expect(authenticateTextDe).toContain('Authentifizierung');

  await page.getByText('EN', { exact: true }).click();

  const authenticateTextEn = await page.textContent('h1:visible', {
    timeout: 5000,
  });
  expect(authenticateTextEn).toContain('Authentication');
});

test('Language EN -> DE', async ({ page }) => {
  await page.goto('http://localhost:5173/auth');

  await page.getByText('EN', { exact: true }).click();

  const authenticateTextEn = await page.textContent('h1:visible', {
    timeout: 5000,
  });
  expect(authenticateTextEn).toContain('Authentication');

  await page.getByText('DE', { exact: true }).click();

  const authenticateTextDe = await page.textContent('h1:visible', {
    timeout: 5000,
  });
  expect(authenticateTextDe).toContain('Authentifizierung');
});
