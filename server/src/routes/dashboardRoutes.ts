import { Hono, type Context } from "hono";
import { dashboardService } from "../services/index.ts";
import type { DashboardSummaryDB } from "../modules/dashboard/types.ts";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import { da } from "date-fns/locale";
import { normalizeDashboardSummary } from "../modules/dashboard/summary.ts";

const app = new Hono();

// Example route: GET /dashboard
app.get("/getDashboardSummary", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	const summary = (await dashboardService.getDashboardSummary(
		userID,
		targetDate
	)) as DashboardSummaryDB;

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
