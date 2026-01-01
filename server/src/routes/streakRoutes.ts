import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.js";
import { streaksService } from "../services/index.js";

const app = new Hono();

// WORKOUT STREAKS //

app.get("/getWorkoutStreaks", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	const data = await streaksService.getWorkoutStreaks(userID, targetDate);

	if (data instanceof Error) {
		const errResp = getResponseError(data, {
			activeDays: null,
			currentStreak: null,
			longestStreak: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk(data);
	return ctx.json(resp);
});

// HABIT STREAKS //

app.get("/getHabitStreaks", async (ctx: Context) => {
	const { userID, habitID: id, targetDate } = ctx.req.query();
	const habitID = Number(id);
	// do stuff
	const data = await streaksService.getHabitStreaks(
		userID,
		habitID,
		targetDate
	);

	if (data instanceof Error) {
		const errResp = getResponseError(data, {
			goalDays: null,
			currentStreak: null,
			longestStreak: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk(data);

	return ctx.json(resp);
});

export default app;
