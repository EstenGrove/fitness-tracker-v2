import { Hono, type Context } from "hono";
import { dashboardService } from "../services/index.js";
import type { DashboardSummaryDB } from "../modules/dashboard/types.js";
import { getResponseError, getResponseOk } from "../utils/api.js";
import { normalizeDashboardSummary } from "../modules/dashboard/summary.js";

const app = new Hono();

// Example route: GET /dashboard
app.get("/getDashboardSummary", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	const summary = (await dashboardService.getDashboardSummary(
		userID,
		targetDate
	)) as DashboardSummaryDB;

	console.log("summary", summary);

	if (summary instanceof Error) {
		const errResp = getResponseError(summary, {
			dailyMins: [],
			dailySteps: [],
			dailyCalories: [],
			dailyWorkouts: [],
		});

		return ctx.json(errResp);
	}

	const dashboardSummary = normalizeDashboardSummary(summary);

	const resp = getResponseOk(dashboardSummary);

	return ctx.json(resp);
});

export default app;
