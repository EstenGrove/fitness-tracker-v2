import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import { workoutsService } from "../services/index.ts";
import type {
	TodaysWorkoutClient,
	TodaysWorkoutDB,
} from "../modules/workouts/types.ts";
import { normalizeTodaysWorkout } from "../modules/workouts/todaysWorkouts.ts";

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

export default app;
