import { Hono, type Context } from "hono";
import { getWeeklyRecap } from "../modules/weeklyRecap/getWeeklyRecap.js";
import type { WeeklyRecap } from "../modules/weeklyRecap/types.js";
import { getResponseError, getResponseOk } from "../utils/api.js";

const app = new Hono();

app.get("/getWeeklyRecap", async (ctx: Context) => {
	const { userID, startDate, endDate } = ctx.req.query();

	const recap = (await getWeeklyRecap(userID, {
		startDate,
		endDate,
	})) as WeeklyRecap;

	if (recap instanceof Error) {
		const errResp = getResponseError(recap);
		return ctx.json(errResp);
	}

	const resp = getResponseOk(recap);

	return ctx.json(resp);
});

app.get("/getRecapForRange", async (ctx: Context) => {
	const { userID, startDate, endDate } = ctx.req.query();
});

export default app;
