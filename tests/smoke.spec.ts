import { expect, test } from '@playwright/test';

// Key templates (docs/09 §7 Lighthouse list + one of each other template).
const PAGES = [
  '/',
  '/tours',
  '/tours/sri-lanka-7-day-tour',
  '/destinations',
  '/destinations/ella',
  '/experiences/beaches',
  '/hotel-deals',
  '/services/flight-tickets',
  '/travel-guide',
  '/travel-guide/sri-lanka-visa-eta',
  '/plan-your-trip',
  '/contact',
  '/about',
  '/faq',
];

for (const path of PAGES) {
  test(`${path} — SEO basics, no console errors, no horizontal scroll`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (err) => errors.push(err.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/.{10,60}/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{120,165}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://paradisetravels.lk${path === '/' ? '/' : path}`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
    for (const script of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(() => JSON.parse(script)).not.toThrow();
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('home has TravelAgency schema', async ({ page }) => {
  await page.goto('/');
  const types = (await page.locator('script[type="application/ld+json"]').allTextContents())
    .flatMap((s) => [JSON.parse(s)].flat())
    .map((item: { '@type': string }) => item['@type']);
  expect(types).toContain('TravelAgency');
});

test('skip link moves focus to main content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard test is desktop-only');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('mobile menu opens and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'drawer is the mobile navigation');
  await page.goto('/about');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const drawer = page.getByRole('dialog', { name: 'Menu' });
  await expect(drawer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
});

test('tour filters narrow the list', async ({ page }) => {
  await page.goto('/tours');
  const visible = () => page.locator('li[data-duration]:visible').count();
  const before = await visible();
  await page.getByLabel('10+ days').check();
  expect(await visible()).toBeLessThan(before);
});

test('trip builder steps through to the review screen', async ({ page }) => {
  await page.goto('/plan-your-trip?where=Ella');
  await expect(page.getByText('Including: Ella')).toBeVisible();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { name: 'Check your request' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send my trip request' })).toBeVisible();
});

test('enquiry form shows inline validation errors from the server', async ({ page }) => {
  await page.goto('/contact');
  const form = page.locator('#enquiry-form');
  await form.getByLabel('Your name').fill('A');
  await form.getByRole('textbox', { name: 'Email' }).fill('a@b.co');
  await form.getByLabel('How can we help?').fill('Hi');
  // Bypass browser validation to exercise the server's.
  await form.evaluate((f: HTMLFormElement) => (f.noValidate = true));
  await form.getByRole('button', { name: 'Send message' }).click();
  await expect(form.locator('[data-form-message]')).toHaveText(/check the highlighted fields/i);
  await expect(form.getByLabel('Your name')).toHaveAttribute('aria-invalid', 'true');
});

test('unknown URLs return a real 404', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('robots, sitemap and llms.txt are served', async ({ request }) => {
  expect((await request.get('/robots.txt')).status()).toBe(200);
  expect(await (await request.get('/sitemap-0.xml')).text()).toContain('/tours/sri-lanka-7-day-tour');
  expect(await (await request.get('/llms.txt')).text()).toContain('Paradise Travels (Pvt) Ltd');
  expect((await request.get('/api/health')).status()).toBe(200);
});
