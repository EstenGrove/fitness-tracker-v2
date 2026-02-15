import { Hono, type Context } from "hono";
import { getUserPreferences } from "../modules/preferences/getUserPreferences.js";
import { getResponseError, getResponseOk } from "../utils/api.js";

const app = new Hono();

app.get("/getPreferences", async (ctx: Context) => {
	const { userID } = ctx.req.query();

	const preferences = await getUserPreferences(userID);

	if (preferences instanceof Error) {
		const errResp = getResponseError(preferences);
		return ctx.json(errResp);
	}

	const resp = getResponseOk({
		preferences,
	});
	return ctx.json(resp);
});
