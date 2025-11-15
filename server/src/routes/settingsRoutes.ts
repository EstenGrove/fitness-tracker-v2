import { type Context, Hono } from "hono";
import { getJobsSummary } from "../modules/settings/getJobsSummary.js";
import { getResponseError, getResponseOk } from "../utils/api.js";
import { settingsService } from "../services/index.js";
import { getNavItems } from "../modules/settings/getNavItems.js";

const app = new Hono();

app.get("/", async (ctx: Context) => {
	const { userID } = ctx.req.query();

	return ctx.json({
		settings: [],
	});
});

app.get("/getNavItems", async (ctx: Context) => {
	const { userID } = ctx.req.query();

	const navItems = await getNavItems();

	if (navItems instanceof Error) {
		const errResp = getResponseError(navItems);

		return ctx.json(errResp);
	}

	const resp = getResponseOk(navItems);
	return ctx.json(resp);
});

app.get("/profile", async (ctx: Context) => {
	const { userID } = ctx.req.query();

	return ctx.json({
		settings: [],
	});
});

// Background Jobs (eg. Refresh Workout Schedules Job, etc.)
app.get("/jobs", async (ctx: Context) => {
	const { userID } = ctx.req.query();

	const summaryDetails = await getJobsSummary();

	if (summaryDetails instanceof Error) {
		const errResp = getResponseError(summaryDetails);
		return ctx.json(errResp);
	}

	const resp = getResponseOk(summaryDetails);

	return ctx.json(resp);
});

export default app;
