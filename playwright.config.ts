import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.ts",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    channel: "chromium",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/next-move-check",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  outputDir: ".playwright-results",
  reporter: "list",
});
