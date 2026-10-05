import { expect, test } from '@playwright/test';

test('home page has the SEO basics and no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));

  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page).toHaveTitle(/Paradise Travels/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{140,160}/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://paradisetravels.lk/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);

  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? '[]');
  expect(jsonLd.map((item: { '@type': string }) => item['@type'])).toContain('TravelAgency');

  expect(errors).toEqual([]);
});

test('skip link moves focus to main content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard test is desktop-only');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('unknown URLs return a real 404', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
});
