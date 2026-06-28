import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./src/__tests__/e2e",
	timeout: 30_000,
	retries: process.env.CI ? 2 : 0,
	use: {
		baseURL: "http://localhost:5175",
		headless: true,
		screenshot: "only-on-failure",
		trace: "on-first-retry",
	},
	webServer: {
		command: "npm run dev",
		url: "http://localhost:5175",
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
	],
});
