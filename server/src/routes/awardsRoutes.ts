import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.js";
import { awardsService } from "../services/index.js";

const app = new Hono();

app.get("/getWorkoutAwardsAndStreaks", async (ctx: Context) => {
	const { userID, targetDate } = ctx.req.query();

	const data = await awardsService.getWorkoutAwardsAndStreaks(
		userID,
		targetDate,
	);

	if (data instanceof Error) {
		const errResp = getResponseError(data);
		return ctx.json(errResp);
	}

	const resp = getResponseOk(data);
	console.log("data", data);

	return ctx.json(resp);
});

export default app;
