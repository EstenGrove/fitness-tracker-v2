import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.ts";
import type {
	LoggedIn,
	LoginParams,
	LogoutParams,
} from "../modules/auth/types.ts";
import { login } from "../modules/auth/login.ts";
import { normalizeLoginData } from "../modules/auth/normalize.ts";
import { setCookie } from "hono/cookie";
import { normalizeSession } from "../modules/user/user.ts";
import { logout } from "../modules/auth/logout.ts";
import type { SessionDB } from "../modules/user/types.ts";

const app = new Hono();

app.post("/login", async (ctx: Context) => {
	const { username, password } = await ctx.req.json<LoginParams>();

	if (!username || !password) {
		const err = new Error("Username AND password are REQUIRED!");
		const errResp = getResponseError(err, {
			user: null,
			session: null,
		});
		return ctx.json(errResp);
	}

	const loginData = await login(username, password);

	if (loginData instanceof Error) {
		const errResp = getResponseError(loginData, {
			user: null,
			session: null,
		});
		return ctx.json(errResp);
	}

	const token = loginData.token;
	const { currentUser, currentSession }: LoggedIn =
		normalizeLoginData(loginData);

	const resp = getResponseOk({
		token: token,
		user: currentUser,
		session: currentSession,
	});

	setCookie(ctx, "access_token", token, {
		httpOnly: true,
		path: "/",
		secure: true,
		sameSite: "Strict",
	});

	return ctx.json(resp);
});
app.post("/logout", async (ctx: Context) => {
	const { userID, sessionID } = await ctx.req.json<LogoutParams>();
	console.log("userID", userID);
	console.log("sessionID", sessionID);

	if (!userID || !sessionID) {
		const err = new Error("Missing userID or sessionID");
		const errResp = getResponseError(err, {
			wasLoggedOut: false,
			session: null,
		});
		return ctx.json(errResp);
	}
	const logoutData = await logout(userID, sessionID);

	console.log("logoutData", logoutData);

	if (logoutData instanceof Error) {
		const errResp = getResponseError(logoutData, {
			wasLoggedOut: false,
			session: null,
		});
		return ctx.json(errResp);
	}

	const userData = normalizeLoginData(logoutData);
	const wasLoggedOut = !!logoutData.currentSession;

	// Clear 'access_token'
	setCookie(ctx, "access_token", "", {
		httpOnly: true,
		path: "/",
		secure: true,
		sameSite: "Strict",
	});

	const resp = getResponseOk({
		wasLoggedOut: wasLoggedOut,
		user: userData.currentUser,
		session: userData.currentSession,
	});
	return ctx.json(resp);
});

export default app;
