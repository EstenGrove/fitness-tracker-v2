import { type Context, Hono } from "hono";
import { recentActivityService } from "../services/index.ts";
import { getRecentActivityFor } from "../modules/recentActivity/summaryFor.ts";
import type {
	ActivityRangeType,
	ActivitySummaryFor,
	ActivitySummaryForDB,
} from "../modules/recentActivity/types.ts";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import { normalizeRecentSummary } from "../modules/recentActivity/normalizeSummary.ts";

const app = new Hono();

app.get("/getRecentActivitySummary", async (ctx: Context) => {
	const { userID, targetDate, rangeType: type } = ctx.req.query();
	const rangeType = type as ActivityRangeType;

	console.log("rangeType", rangeType);

	const rawSummary = (await getRecentActivityFor(userID, {
		targetDate,
		rangeType,
	})) as ActivitySummaryForDB;

	console.log("rawSummary	", rawSummary);

	if (rawSummary instanceof Error) {
		const errResp = getResponseError(rawSummary, {
			summaries: {},
			dateRange: {},
			totalMins: {},
			segments: [],
		});
		return ctx.json(errResp);
	}

	const recentSummary = normalizeRecentSummary(rawSummary);
	const resp = getResponseOk(recentSummary);

	return ctx.json(resp);
});

export default app;
