import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import { workoutsService } from "../services/index.ts";
import type {
	TodaysWorkoutClient,
	TodaysWorkoutDB,
	WorkoutDetailsDB,
} from "../modules/workouts/types.ts";
import { normalizeTodaysWorkout } from "../modules/workouts/todaysWorkouts.ts";
import { normalizeWorkoutDetails } from "../modules/workouts/workoutDetails.ts";

const app = new Hono();

app.get("/getTodaysWorkouts", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	console.log("userID", userID);

	const workouts = (await workoutsService.getTodaysWorkouts(
		userID,
		targetDate
	)) as TodaysWorkoutDB[];

	console.log("workouts", workouts);

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

	const details = (await workoutsService.getWorkoutDetails(
		userID,
		Number(workoutID),
		activityType
	)) as WorkoutDetailsDB;

	if (details instanceof Error) {
		const errResp = getResponseError(details, {
			workout: null,
			schedule: null,
			history: [],
		});
		return ctx.json(errResp);
	}

	const workoutDetails = normalizeWorkoutDetails(details);

	const resp = getResponseOk({
		workout: workoutDetails.workout,
		schedule: workoutDetails.schedule,
		history: workoutDetails.history,
	});
	return ctx.json(resp);
});

export default app;
