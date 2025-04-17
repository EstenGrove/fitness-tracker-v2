import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import type { Activity } from "../modules/types.ts";
import { historyService } from "../services/index.ts";
import {
	normalizeAllHistory,
	normalizeHistoryByType,
} from "../modules/history/allHistory.ts";
import type {
	AllHistoryDB,
	HistoryOfType,
	HistoryOfTypeDB,
} from "../modules/history/types.ts";

const app = new Hono();

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

export default app;
