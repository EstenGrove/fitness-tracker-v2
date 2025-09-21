import { Hono, type Context } from "hono";
import { summaryService } from "../services/index.js";
import { getResponseError, getResponseOk } from "../utils/api.js";
import { getWorkoutHistoryCalendarDetails } from "../modules/summary/getWorkoutHistoryCalendarDetails.js";

const app: Hono = new Hono();

app.get("/getSummaryForEntireYear", async (ctx: Context) => {
	const defaultYear = new Date().getFullYear();
	const { userID, targetYear = defaultYear, activityType } = ctx.req.query();

	// getSummaryForEntireYear(userID, activityType, targetYear)
});

app.get("/getWorkoutHistoryCalendar", async (ctx: Context) => {
	const { userID, baseDate } = ctx.req.query();

	const data = await summaryService.getWorkoutHistoryCalendar(userID, baseDate);

	if (data instanceof Error) {
		const errResp = getResponseError(data, {
			calendarData: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		calendarData: data,
	});

	return ctx.json(resp);
});

app.get("/getWorkoutHistoryCalendarDetails", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	const results = await getWorkoutHistoryCalendarDetails(userID, targetDate);

	if (results instanceof Error) {
		const errResp = getResponseError(results, {
			scheduledWorkouts: [],
			performedWorkouts: [],
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk(results);
	return ctx.json(resp);
});

export default app;
