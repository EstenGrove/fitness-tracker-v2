import { Hono, type Context } from "hono";
import { getUserHabits } from "../modules/habits/getUserHabits.ts";
import type {
	Habit,
	HabitLog,
	HabitLogValues,
} from "../modules/habits/types.ts";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import { logHabit } from "../modules/habits/logHabit.ts";
import { getHabitDetails } from "../modules/habits/getHabitDetails.ts";
import { logHabitsBatched } from "../modules/habits/logHabitsBatched.ts";

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

app.get("/getHabitDetails", async (ctx: Context) => {
	const { userID, habitID, targetDate } = ctx.req.query();

	const details = await getHabitDetails({
		userID: userID,
		habitID: Number(habitID),
		targetDate: targetDate,
	});

	if (details instanceof Error) {
		const errResp = getResponseError(details);
		return ctx.json(errResp);
	}

	const resp = getResponseOk(details);

	return ctx.json(resp);
});

app.post("/logHabit", async (ctx: Context) => {
	const body = await ctx.req.json();
	const logVals = body as HabitLogValues;

	const newLog = (await logHabit(logVals)) as HabitLog;

	if (newLog instanceof Error) {
		const errResp = getResponseError(newLog, {
			newLog: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		newLog: newLog,
	});
	return ctx.json(resp);
});

app.post("/logHabitsBatched", async (ctx: Context) => {
	const body = await ctx.req.json<{ newLogs: HabitLogValues[] }>();
	const newLogs: HabitLogValues[] = body.newLogs;

	console.log("newLogs", newLogs);

	const habitLogs = (await logHabitsBatched(newLogs)) as HabitLog[];

	console.log("habitLogs", habitLogs);

	if (habitLogs instanceof Error) {
		const errResp = getResponseError(habitLogs, {
			newLogs: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		newLogs: habitLogs,
	});

	return ctx.json(resp);
});

export default app;
