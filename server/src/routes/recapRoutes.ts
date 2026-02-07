import { Hono, type Context } from "hono";
import { getActivityRecapDetails } from "../modules/recap-details/getActivityRecapDetails.js";
import type { Activity } from "../modules/types.js";
import { getResponseError, getResponseOk } from "../utils/api.js";
import type { ActivityRecapDetails } from "../modules/recap-details/types.js";

const app = new Hono();

app.get("/getWorkoutRecap", async (ctx: Context) => {
	const { userID, activityType, workoutID, lastXDays } = ctx.req.query();

	const type = activityType as Activity;
	const id = Number(workoutID);

	const recap = (await getActivityRecapDetails(
		userID,
		type,
		id
	)) as ActivityRecapDetails;

	if (recap instanceof Error) {
		const errResp = getResponseError(recap);

		return ctx.json(errResp);
	}

	const resp = getResponseOk(recap);

	return ctx.json(resp);
});

export default app;
