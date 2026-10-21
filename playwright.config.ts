import { defineConfig, devices } from '@playwright/test';

// Runs against the static build (run `npm run build` first), with the PHP form handlers behind `php -S`.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4321' },
  // Static build + PHP's built-in server for the form endpoints (mail goes nowhere).
  webServer: [
    {
      command: 'php -d "sendmail_path=cat > /dev/null" -S 127.0.0.1:8099 -t dist',
      url: 'http://127.0.0.1:8099/api/health.php',
      reuseExistingServer: !process.env.CI,
      env: { PT_NO_RATE_LIMIT: '1' },
    },
    {
      command: 'node scripts/serve-compressed.mjs',
      url: 'http://localhost:4321',
      reuseExistingServer: !process.env.CI,
      env: { PHP_PROXY: 'http://127.0.0.1:8099' },
    },
  ],
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});
