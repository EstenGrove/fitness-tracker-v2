/**
 * Dashboard tests — all run with mocked auth.
 *
 * These use the `authedPage` fixture from fixtures/auth.ts, which intercepts
 * all API calls and returns mock data. The result: tests run without the
 * backend, without real credentials, and without Google OAuth.
 */
import { test, expect } from "./fixtures/auth";

test.describe("Dashboard (authenticated)", () => {
	test("loads the dashboard and shows the Dashboard heading", async ({ authedPage: page }) => {
		await page.goto("/");

		// Wait for the page heading to appear (lazy-loaded, may need a moment)
		await expect(page.getByRole("heading", { name: /Dashboard/i })).toBeVisible({
			timeout: 10_000,
		});
	});

	test("navigating to /workouts renders the workouts page", async ({ authedPage: page }) => {
		await page.goto("/workouts");

		// URL should stay at /workouts (no redirect to /login since auth is mocked)
		await expect(page).toHaveURL(/\/workouts/, { timeout: 10_000 });
	});

	test("navigating to /habits renders the habits page", async ({ authedPage: page }) => {
		await page.goto("/habits");

		await expect(page).toHaveURL(/\/habits/, { timeout: 10_000 });
	});

	test("navigating to /stats renders the stats page", async ({ authedPage: page }) => {
		await page.goto("/stats");

		await expect(page).toHaveURL(/\/stats/, { timeout: 10_000 });
	});

	test("navigating to a non-existent route shows the 404 page", async ({ authedPage: page }) => {
		await page.goto("/this-route-does-not-exist");

		// The NotFound page should render — look for common 404 copy
		// Adjust the text matcher if your NotFoundPage uses different wording
		await expect(
			page.getByText(/not found|404|page doesn't exist/i)
		).toBeVisible({ timeout: 8_000 });
	});
});
