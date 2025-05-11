import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import type { Activity } from "../modules/types.ts";
import { historyService } from "../services/index.ts";
import {
	normalizeAllHistory,
	normalizeHistoryByType,
	normalizeHistoryEntryByType,
} from "../modules/history/allHistory.ts";
import type {
	AllHistoryDB,
	HistoryDetailsDB,
	HistoryOfType,
	HistoryOfTypeDB,
	WorkoutHistoryDB,
} from "../modules/history/types.ts";
import {
	getLastWorkoutByDate,
	type LastSessionParams,
} from "../modules/history/getLastWorkout.ts";
import { normalizeHistoryDetails } from "../modules/history/historyDetails.ts";

const app = new Hono();

app.get("/getLastWorkout", async (ctx: Context) => {
	const details = ctx.req.query();
	const params = details as unknown as LastSessionParams;
	const type = params.activityType as Activity;
	const last = (await getLastWorkoutByDate(params)) as HistoryOfTypeDB;

	if (last instanceof Error) {
		const errResp = getResponseError(last);

		return ctx.json(errResp);
	}

	console.log("type", type);
	console.log("last", last);
	const lastSession: HistoryOfType = normalizeHistoryEntryByType(type, last);

	console.log("lastSession", lastSession);

	const resp = getResponseOk({
		lastSession: lastSession,
	});

	return ctx.json(resp);
});
app.get("/getHistoryByRange", async (ctx: Context) => {
	const { userID, startDate, endDate } = ctx.req.query();

	const raw = (await historyService.getHistoryForRange(userID, {
		startDate,
		endDate,
	})) as AllHistoryDB;

	console.log("raw", raw);

	if (raw instanceof Error) {
		const errResp = getResponseError(raw, {
			all: [],
			strength: [],
			stretch: [],
			cardio: [],
			walk: [],
			timed: [],
			other: [],
		});
		return ctx.json(errResp);
	}

	const allHistory = normalizeAllHistory(raw);

	const resp = getResponseOk(allHistory);

	return ctx.json(resp);
});
app.get("/getHistoryByRangeAndType", async (ctx: Context) => {
	const { userID, activityType, startDate, endDate } = ctx.req.query();
	const type = activityType as Activity;

	const records = (await historyService.getHistoryForRangeAndActivity(
		userID,
		type,
		{
			startDate,
			endDate,
		}
	)) as HistoryOfTypeDB[];

	if (records instanceof Error) {
		const errResp = getResponseError(records, {
			history: [],
		});
		return ctx.json(errResp);
	}

	const history: HistoryOfType[] = normalizeHistoryByType(type, records);

	console.log("records", records);

	const resp = getResponseOk({
		history: history,
	});

	return ctx.json(resp);
});
app.get("/getHistoryDetails", async (ctx: Context) => {
	const { userID, historyID, activityType } = ctx.req.query();
	const type = activityType as Activity;
	console.log("type", type);

	const history = (await historyService.getHistoryDetails(
		userID,
		Number(historyID),
		type
	)) as HistoryDetailsDB;

	console.log("history", history);

	if (history instanceof Error) {
		const errResp = getResponseError(history, {
			history: null,
		});
		return ctx.json(errResp);
	}
	const historyDetails = normalizeHistoryDetails(history);
	const resp = getResponseOk(historyDetails);
	return ctx.json(resp);
});

export default app;
