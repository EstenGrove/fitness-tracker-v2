/**
 * Smoke tests — no auth required.
 * These verify the most basic question: "does the app load at all?"
 */
import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {
	test("login page loads without crashing", async ({ page }) => {
		await page.goto("/login");

		// The app shell mounts
		await expect(page.locator("#root")).toBeVisible();

		// The page heading is present
		await expect(page.getByRole("heading", { name: /Fitness Tracker/i })).toBeVisible();
	});

	test("login page shows the sign-in form", async ({ page }) => {
		await page.goto("/login");

		await expect(page.getByLabel(/username/i)).toBeVisible();
		await expect(page.getByLabel(/password/i)).toBeVisible();
		await expect(page.getByRole("button", { name: /sign-in with google/i })).toBeVisible();
	});

	test("navigating to / without auth triggers redirect to /login", async ({ page }) => {
		// No mocked auth — the app's refresh call will get nothing (network error)
		// and the DashboardLayout should redirect to /login.
		// We intercept the refresh endpoint to return a failure so the redirect is deterministic.
		await page.route("**/api/v1/auth/refresh", (route) =>
			route.fulfill({ status: 401, json: { Status: "REJECTED", Data: null } })
		);

		await page.goto("/");

		// Should land on /login after the failed auth check
		await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
	});
});
