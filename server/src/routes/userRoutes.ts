import { Hono, type Context } from "hono";
import { getResponseOk } from "../utils/api.ts";
import { userExists } from "../modules/user/userExists.ts";

const app = new Hono();

app.get("/getUserExists", async (ctx: Context) => {
	const { username, password } = ctx.req.query();

	const isActiveUser = await userExists(username, password);

	const resp = getResponseOk({
		isActiveUser,
	});
	return ctx.json(resp);
});

export default app;
