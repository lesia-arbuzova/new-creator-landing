import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "3000";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  // Дві паралельні сторінки декодують 32 showreel-відео й можуть аварійно
  // завершити Chromium на Windows; послідовний прогін стабільний і відтворюваний.
  workers: 1,
  reporter: "line",
  use: {
    baseURL: `http://localhost:${port}`,
    serviceWorkers: "block",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 5"], viewport: { width: 390, height: 844 } } },
  ],
});
