import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.js";
import type { Activity, DateRange } from "../modules/types.js";
import { getActivityMetricsComparison } from "../modules/metrics/getActivityMetricsPostWorkout.js";

type ActivityMetricsAfterParams = {
	userID: string;
	activityType: Activity;
	workoutID: number;
	historyID: number;
	range: DateRange;
};

const app = new Hono();

// Retrieves metrics for historical data, this specific session & a comparison delta
app.get("/getActivityMetricsAfterWorkout", async (ctx: Context) => {
	const {
		userID,
		activityType: type,
		workoutID,
		historyID,
		startDate,
		endDate,
	} = ctx.req.query();
	const activityType = type as Activity;

	const metrics = await getActivityMetricsComparison(userID, {
		activityType,
		workoutID: Number(workoutID),
		historyID: Number(historyID),
		range: { startDate, endDate },
	});

	if (metrics instanceof Error) {
		const errResp = getResponseError(metrics);
		return ctx.json(errResp);
	}

	const resp = getResponseOk(metrics);
	return ctx.json(resp);
});

export default app;
