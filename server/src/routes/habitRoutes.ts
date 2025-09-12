import { Hono, type Context } from "hono";
import { getUserHabits } from "../modules/habits/getUserHabits.js";
import type {
	Habit,
	HabitCard,
	HabitHistory,
	HabitHistoryForRange,
	HabitLog,
	HabitLogValues,
	HabitYearSummary,
	NewHabitValues,
	RecentHabitLog,
} from "../modules/habits/types.js";
import { getResponseError, getResponseOk } from "../utils/api.js";
import { logHabit } from "../modules/habits/logHabit.js";
import { getHabitDetails } from "../modules/habits/getHabitDetails.js";
import { logHabitsBatched } from "../modules/habits/logHabitsBatched.js";
import { getHabitCards } from "../modules/habits/getHabitCards.js";
import { createHabit } from "../modules/habits/createHabit.js";
import { getRecentHabitLogs } from "../modules/habits/getRecentHabitLogs.js";
import { getHabitHistory } from "../modules/habits/getHabitHistory.js";
import { habitsService } from "../services/index.js";
import type { HabitWeekResp } from "../services/HabitsService.js";
import { getHabitHistorySummary } from "../modules/habits/getHabitHistorySummary.js";
import { getHabitHistoryForRange } from "../modules/habits/getHabitHistoryForRange.js";

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

app.get("/getHabitCards", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	const cards = (await getHabitCards(userID, targetDate)) as HabitCard[];

	if (cards instanceof Error) {
		const errResp = getResponseError(cards, {
			habits: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		habits: cards,
	});

	return ctx.json(resp);
});

app.get("/getRecentHabitLogs", async (ctx: Context) => {
	const { userID, targetDate, lastXDays: days } = ctx.req.query();
	const lastXDays = Number(days) || 3;

	const recentLogs = (await getRecentHabitLogs(userID, {
		targetDate,
		lastXDays,
	})) as RecentHabitLog[];

	if (recentLogs instanceof Error) {
		const errResp = getResponseError(recentLogs, {
			recentLogs: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		recentLogs: recentLogs,
	});
	return ctx.json(resp);
});

app.post("/createHabit", async (ctx: Context) => {
	const { userID } = ctx.req.query();
	const body = await ctx.req.json<{
		userID: string;
		newHabit: NewHabitValues;
	}>();
	const values = body.newHabit as NewHabitValues;
	const id = userID || body.userID;
	const newHabit = await createHabit(id, values);

	if (newHabit instanceof Error) {
		const errResp = getResponseError(newHabit, {
			newHabit: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		newHabit: newHabit,
	});
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

app.get("/getHabitHistory", async (ctx: Context) => {
	const params = ctx.req.query();
	const { userID } = params;
	const id = Number(params.habitID);
	const lastDays = Number(params.lastXDays);

	const history = (await getHabitHistory(userID, id, lastDays)) as HabitHistory;

	if (history instanceof Error) {
		const errResp = getResponseError(history, {
			history: [],
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		history: history,
	});

	return ctx.json(resp);
});

app.get("/getHabitWeek", async (ctx: Context) => {
	const { userID, habitID: id, targetDate } = ctx.req.query();
	const habitID = Number(id);

	const habitWeek = (await habitsService.getHabitWeek(
		userID,
		habitID,
		targetDate
	)) as HabitWeekResp;
	if (habitWeek instanceof Error) {
		const errResp = getResponseError(habitWeek, {
			habit: {},
			summary: [],
			dateRange: {
				startDate: null,
				endDate: null,
			},
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk(habitWeek);
	return ctx.json(resp);
});

// Fetches custom summary that compares goals, and total logged based off the goal at the time.
app.get("/getHabitHistorySummary", async (ctx: Context) => {
	const { userID, habitID: id, year } = ctx.req.query();
	const targetYear = Number(year);
	const habitID = Number(id);

	const result = (await getHabitHistorySummary(
		userID,
		habitID,
		targetYear
	)) as HabitYearSummary;

	if (result instanceof Error) {
		const errResp = getResponseError(result, {
			habit: null,
			summary: null,
			dateRange: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk(result);

	return ctx.json(resp);
});

app.get("/getHabitHistoryForRange", async (ctx: Context) => {
	const { userID, habitID: id, startDate, endDate } = ctx.req.query();
	const habitID = Number(id);

	const historyData = (await getHabitHistoryForRange({
		userID,
		habitID,
		startDate,
		endDate,
	})) as HabitHistoryForRange;

	if (historyData instanceof Error) {
		const errResp = getResponseError(historyData, {
			habit: null,
			history: null,
			summary: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk(historyData);

	return ctx.json(resp);
});

export default app;
