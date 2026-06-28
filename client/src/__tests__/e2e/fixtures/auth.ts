import { test as base, type Page } from "@playwright/test";
import {
	mockUser,
	mockSession,
	FAKE_JWT,
	mockDashboardSummary,
	wrapResponse,
} from "./mockData";

const API_BASE = "http://localhost:3002/api/v1";

// Returns the appropriate mock payload for a given API URL.
// Add new cases here as you write tests for more features.
function getMockForUrl(url: string) {
	if (url.includes("/auth/refresh")) {
		return wrapResponse({
			currentUser: mockUser,
			currentSession: mockSession,
			token: FAKE_JWT,
			error: null,
		});
	}

	if (url.includes("/dashboard/getDashboardSummary")) {
		return wrapResponse(mockDashboardSummary);
	}

	// Default: return an empty success so RTK Query doesn't error out
	return wrapResponse(null);
}

// Sets up API interception so all calls to the backend return mock data.
// This lets tests run without the backend running and sidesteps Google OAuth.
async function interceptApi(page: Page) {
	await page.route(`${API_BASE}/**`, async (route) => {
		const url = route.request().url();
		await route.fulfill({ json: getMockForUrl(url) });
	});
}

// `authedPage` is a Playwright fixture that gives you a page with all API
// calls mocked. Use it instead of `page` in tests that need auth.
export const test = base.extend<{ authedPage: Page }>({
	authedPage: async ({ page }, use) => {
		await interceptApi(page);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		await use(page);
	},
});

export { expect } from "@playwright/test";
