import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import { workoutsService } from "../services/index.ts";
import type {
	LogWorkoutBody,
	SkipWorkoutBody,
	TodaysWorkoutClient,
	TodaysWorkoutDB,
	Workout,
	WorkoutDB,
	WorkoutDetailsDB,
} from "../modules/workouts/types.ts";
import { normalizeTodaysWorkout } from "../modules/workouts/todaysWorkouts.ts";
import { normalizeWorkoutDetails } from "../modules/workouts/workoutDetails.ts";
import { normalizeWorkouts } from "../modules/workouts/workouts.ts";
import {
	logWorkout,
	normalizeWorkoutLog,
} from "../modules/workouts/logWorkout.ts";
import type { HistoryOfTypeDB } from "../modules/history/types.ts";
import { skipWorkout } from "../modules/workouts/skipWorkout.ts";
import { getPostWorkoutStats } from "../modules/stats/postWorkoutStats.ts";
import type { Activity } from "../modules/types.ts";

const app = new Hono();

app.get("/getAllWorkouts", async (ctx: Context) => {
	const { userID } = ctx.req.query();
	console.log("userID", userID);

	const workouts = (await workoutsService.getAllWorkouts(
		userID
	)) as WorkoutDB[];

	if (workouts instanceof Error) {
		const errResp = getResponseError(workouts, {
			workouts: [],
		});
		return ctx.json(errResp);
	}
	const allWorkouts: Workout[] = normalizeWorkouts(workouts);

	const resp = getResponseOk({
		workouts: allWorkouts,
	});
	return ctx.json(resp);
});

app.get("/getTodaysWorkouts", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	const workouts = (await workoutsService.getTodaysWorkouts(
		userID,
		targetDate
	)) as TodaysWorkoutDB[];

	if (workouts instanceof Error) {
		const errResp = getResponseError(workouts, {
			workouts: [],
		});
		return ctx.json(errResp);
	}

	const todaysWorkouts: TodaysWorkoutClient[] = workouts?.map((entry) =>
		normalizeTodaysWorkout(entry)
	);

	const resp = getResponseOk({
		workouts: todaysWorkouts,
	});

	return ctx.json(resp);
});

app.get("/getSkippedWorkouts", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	const workouts = (await workoutsService.getSkippedWorkouts(
		userID,
		targetDate
	)) as TodaysWorkoutDB[];

	if (workouts instanceof Error) {
		const errResp = getResponseError(workouts, {
			workouts: [],
		});
		return ctx.json(errResp);
	}

	const todaysWorkouts: TodaysWorkoutClient[] = workouts?.map((entry) =>
		normalizeTodaysWorkout(entry)
	);

	const resp = getResponseOk({
		workouts: todaysWorkouts,
	});

	return ctx.json(resp);
});

app.get("/getWorkoutDetails", async (ctx: Context) => {
	const { userID, workoutID, activityType } = ctx.req.query();
	const type = activityType as Activity;

	const details = (await workoutsService.getWorkoutDetails(
		userID,
		Number(workoutID),
		type
	)) as WorkoutDetailsDB;

	if (details instanceof Error) {
		const errResp = getResponseError(details, {
			workout: null,
			schedule: null,
			history: [],
		});
		return ctx.json(errResp);
	}

	const workoutDetails = normalizeWorkoutDetails(type, details);

	const resp = getResponseOk({
		workout: workoutDetails.workout,
		schedule: workoutDetails.schedule,
		history: workoutDetails.history,
	});
	return ctx.json(resp);
});

app.post("/markWorkoutAsDone", async (ctx: Context) => {
	const body = await ctx.req.json();
	const { userID, details } = body;
	// const updatedWorkout = new Error("Not implemented yet");
	const updatedWorkout = await workoutsService.markWorkoutAsDone(details);

	console.log("updatedWorkout", updatedWorkout);

	if (updatedWorkout instanceof Error) {
		const errResp = getResponseError(updatedWorkout, {
			updatedWorkout: null,
			history: [],
		});
		return ctx.json(errResp);
	}
	const todaysWorkout: TodaysWorkoutClient =
		normalizeTodaysWorkout(updatedWorkout);

	const resp = getResponseOk({
		updatedWorkout: todaysWorkout,
		history: [],
	});

	return ctx.json(resp);
});

app.post("/logWorkout", async (ctx: Context) => {
	const body = await ctx.req.json<LogWorkoutBody>();

	const preparedLog = {
		...body,
		duration: body.workoutLength,
	};

	const rawLog = (await logWorkout(preparedLog)) as HistoryOfTypeDB;

	if (rawLog instanceof Error) {
		const errResp = getResponseError(rawLog, {
			newLog: null,
		});
		return ctx.json(errResp);
	}

	const newLog = normalizeWorkoutLog(rawLog);

	console.log("newLog", newLog);

	const resp = getResponseOk({
		newLog: newLog,
	});

	return ctx.json(resp);
});

app.post("/skipWorkout", async (ctx: Context) => {
	const body = await ctx.req.json<SkipWorkoutBody>();
	const { userID } = body;

	const skipped = await skipWorkout(userID, body);

	if (skipped.error) {
		const errResp = getResponseError(skipped.error, {
			error: skipped.error,
			wasSkipped: false,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		error: null,
		wasSkipped: skipped.wasSkipped,
	});

	return ctx.json(resp);
});

app.get("/getPostWorkoutSummary", async (ctx: Context) => {
	const { userID, workoutID, historyID, activityType } = ctx.req.query();
	const type = activityType as Activity;

	const rawStats = await getPostWorkoutStats({
		userID: userID,
		workoutID: Number(workoutID),
		historyID: Number(historyID),
		activityType: type,
	});

	if (rawStats instanceof Error) {
		const errResp = getResponseError(rawStats);
		return ctx.json(errResp);
	}

	console.log("rawStats", rawStats);

	const resp = getResponseOk(rawStats);

	return ctx.json(resp);
});

export default app;
