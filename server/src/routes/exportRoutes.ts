import { Hono, type Context } from "hono";
import { getResponseError } from "../utils/api.js";
import { exportWorkoutHistory } from "../modules/exports/exportWorkoutHistory.js";

// Various Routes for Exporting Data to Files
const app = new Hono();

// Exports to CSV
app.get("/workout-history", async (ctx: Context) => {
	const { userID, startDate, endDate } = ctx.req.query();

	if (!userID) {
		const err = new Error("Internal Server Error: No userID was provided!");
		const errResp = getResponseError(err);
		return ctx.json(errResp, 500);
	}

	const stamp = Date.now();
	const filename = `WorkoutHistory_${stamp}.csv`;
	const data = (await exportWorkoutHistory({
		userID,
		startDate,
		endDate,
	})) as string | unknown;

	if (data instanceof Error) {
		const errResp = getResponseError(data);
		return ctx.json(errResp, 500);
	}

	return ctx.text(data as string, {
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": `attachment; filename="${filename}"`,
		},
	});
});

export default app;
