/**
 * Login page tests.
 * These test the UI behavior of the login page — form validation,
 * button states, error messages — without hitting a real backend.
 */
import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/login");
	});

	test("renders the app heading and subtitle", async ({ page }) => {
		await expect(page.getByRole("heading", { name: /Fitness Tracker/i })).toBeVisible();
		await expect(page.getByText(/Fitness & Habit Tracker/i)).toBeVisible();
	});

	test("Login button is disabled when fields are empty", async ({ page }) => {
		const loginBtn = page.getByRole("button", { name: /^Login$/i });
		await expect(loginBtn).toBeDisabled();
	});

	test("Login button is disabled when only username is filled", async ({ page }) => {
		await page.getByLabel(/username/i).fill("user@example.com");
		const loginBtn = page.getByRole("button", { name: /^Login$/i });
		await expect(loginBtn).toBeDisabled();
	});

	test("Login button is disabled when only password is filled", async ({ page }) => {
		await page.getByLabel(/password/i).fill("password123");
		const loginBtn = page.getByRole("button", { name: /^Login$/i });
		await expect(loginBtn).toBeDisabled();
	});

	test("Login button enables when both fields have valid values", async ({ page }) => {
		await page.getByLabel(/username/i).fill("user@example.com");
		await page.getByLabel(/password/i).fill("password123");
		const loginBtn = page.getByRole("button", { name: /^Login$/i });
		await expect(loginBtn).toBeEnabled();
	});

	test("Login button is disabled for invalid email format", async ({ page }) => {
		// Username field requires an email-like format (contains @)
		await page.getByLabel(/username/i).fill("notanemail");
		await page.getByLabel(/password/i).fill("password123");
		const loginBtn = page.getByRole("button", { name: /^Login$/i });
		await expect(loginBtn).toBeDisabled();
	});

	test("shows an error message when login fails", async ({ page }) => {
		// Mock the userExists endpoint to return "not found"
		await page.route("**/api/v1/user/getUserExists**", (route) =>
			route.fulfill({
				json: {
					Status: "FULFILLED",
					Data: { isActiveUser: false, userNotFound: true, invalidCreds: false },
					Message: "Not found",
					ErrorMsg: null,
					StackTrace: null,
				},
			})
		);

		await page.getByLabel(/username/i).fill("notfound@example.com");
		await page.getByLabel(/password/i).fill("password123");
		await page.getByRole("button", { name: /^Login$/i }).click();

		// Error message should appear
		await expect(page.getByText(/Account not found/i)).toBeVisible({ timeout: 8_000 });
	});

	test("Create Account button navigates to /signup", async ({ page }) => {
		await page.getByRole("button", { name: /Create Account/i }).click();
		await expect(page).toHaveURL(/\/signup/);
	});
});
