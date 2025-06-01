import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.js";
import { userExists, type UserExists } from "../modules/user/userExists.js";

const app = new Hono();

app.get("/getUserExists", async (ctx: Context) => {
	const { username, password } = ctx.req.query();

	const isActiveUser = (await userExists(username, password)) as UserExists;

	console.log("isActiveUser", isActiveUser);

	if (!isActiveUser) {
		const err = new Error("User not found");
		const errResp = getResponseError(err, {
			user: null,
			session: null,
		});
		return ctx.json(errResp);
	}

	const resp = getResponseOk(isActiveUser);

	return ctx.json(resp);
});

export default app;
