import { Hono, type Context } from "hono";
import { historyService } from "../services/index.js";
import { getResponseError, getResponseOk } from "../utils/api.js";
import type { HistoryOfTypeDB } from "../modules/history/types.js";
import {
	getPostWorkoutDetails,
	getPostWorkoutStats,
} from "../modules/stats/postWorkoutStats.js";
import type { Activity } from "../modules/types.js";
import type { PostWorkoutParams } from "../modules/stats/types.js";
import {
	getTotalMinsBy,
	type MinsTotals,
	type MinsTotalsDB,
	type RangeBy,
} from "../modules/stats/getTotalMinsBy.js";

const app = new Hono();

app.get("/getPostWorkoutDetails", async (ctx: Context) => {
	const data = ctx.req.query();
	const params = data as unknown as PostWorkoutParams;
	console.log("params", params);

	const postWorkout = await getPostWorkoutDetails({
		...params,
		workoutID: Number(params.workoutID),
	});

	if (postWorkout instanceof Error) {
		const errResp = getResponseError(postWorkout, {
			workout: null,
			history: null,
			nthStats: null,
		});
		return ctx.json(errResp);
	}

	const response = getResponseOk({
		workout: postWorkout.workout,
		history: postWorkout.history,
		nthStats: postWorkout.nthStats,
	});

	return ctx.json(response);
});
app.get("/getWorkoutStats", async (ctx: Context) => {
	const { userID, workoutID, activityType, targetDate } = ctx.req.query();

	return ctx.json({
		message: "Hi",
	});
});
app.get("/getPostWorkoutStats", async (ctx: Context) => {
	const { userID, workoutID, activityType, targetDate } = ctx.req.query();
	const lastSession = (await historyService.getLastWorkoutSession({
		userID: userID,
		workoutID: Number(workoutID),
		activityType: activityType,
		targetDate: targetDate,
	})) as HistoryOfTypeDB;

	if (!lastSession || lastSession instanceof Error) {
		const errResp = getResponseError(lastSession, {
			stats: null,
		});
		return ctx.json(errResp);
	}

	const historyID: number = lastSession.history_id;
	const stats = await getPostWorkoutStats({
		userID: userID,
		historyID: historyID,
		workoutID: Number(workoutID),
		activityType: activityType as Activity,
	});

	console.log("stats", stats);

	return ctx.json({
		stats: stats,
	});
});

// Summary Stats
app.get("/getMinsSummaryForRange", async (ctx: Context) => {
	const { userID, targetDate, rangeType } = ctx.req.query();

	//
	//
});

app.get("/getTotalMinsBy", async (ctx: Context) => {
	const { userID, targetDate, by } = ctx.req.query();
	const range = by as RangeBy;

	const totalMins = (await getTotalMinsBy(
		userID,
		targetDate,
		range
	)) as MinsTotals[];

	if (totalMins instanceof Error) {
		const errResp = getResponseError(totalMins, {
			totalMins: [],
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		totalMins: totalMins,
	});
	return ctx.json(resp);
});

export default app;
