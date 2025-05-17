import { Hono, type Context } from "hono";
import { getUserHabits } from "../modules/habits/getUserHabits.ts";
import type { Habit } from "../modules/habits/types.ts";
import { getResponseError, getResponseOk } from "../utils/api.ts";

const app = new Hono();

app.get("/getHabits", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	const habits = (await getUserHabits(userID, targetDate)) as Habit[];

	if (habits instanceof Error) {
		const errResp = getResponseError(habits, {
			habits: [],
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		habits,
	});

	return ctx.json(resp);
});

export default app;
