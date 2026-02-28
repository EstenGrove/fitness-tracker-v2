import { Hono, type Context } from "hono";
import type { Activity } from "../modules/types.js";
import { getAIInsights } from "../modules/ai-insights/getAIInsights.js";
import { getResponseError, getResponseOk } from "../utils/api.js";

const app = new Hono();

app.get("/getAIInsights", async (ctx: Context) => {
	const { userID, activityType: type, startDate, endDate } = ctx.req.query();
	const activityType = type as Activity;

	const insights = await getAIInsights<Activity>(userID, {
		activityType,
		startDate,
		endDate,
	});

	console.log("[INSIGHTS]:", insights);

	if (insights instanceof Error) {
		const errResp = getResponseError(insights);
		return ctx.json(errResp);
	}

	const resp = getResponseOk({ insights });
	return ctx.json(resp);
});

export default app;
