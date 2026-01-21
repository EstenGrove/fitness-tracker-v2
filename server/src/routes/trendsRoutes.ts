import { Hono, type Context } from "hono";
import type { Activity } from "../modules/types.js";
import { getActivityTrends } from "../modules/trends/getActivityTrends.js";
import { getResponseError, getResponseOk } from "../utils/api.js";

const app = new Hono();

app.get("/getActivityTrends", async (ctx: Context) => {
	const { userID, activityType, workoutID } = ctx.req.query();

	const id = Number(workoutID);
	const type = activityType as Activity;

	const data = await getActivityTrends(userID, type, id);

	if (data instanceof Error) {
		const errResp = getResponseError(data);
		return ctx.json(errResp);
	}

	const resp = getResponseOk(data);
	return ctx.json(resp);
});

export default app;
