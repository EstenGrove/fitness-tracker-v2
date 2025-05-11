import { Hono, type Context } from "hono";
import { historyService } from "../services/index.ts";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import type { HistoryOfTypeDB } from "../modules/history/types.ts";
import {
	getPostWorkoutDetails,
	getPostWorkoutStats,
} from "../modules/stats/postWorkoutStats.ts";
import type { Activity } from "../modules/types.ts";
import type { PostWorkoutParams } from "../modules/stats/types.ts";

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

export default app;
