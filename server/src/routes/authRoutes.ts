import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.js";
import type {
	LoggedIn,
	LoginParams,
	LogoutParams,
	RefreshResponse,
} from "../modules/auth/types.js";
import { login } from "../modules/auth/login.js";
import { normalizeLoginData } from "../modules/auth/normalize.js";
import { getCookie, setCookie } from "hono/cookie";
import { normalizeSession } from "../modules/user/user.js";
import { logout } from "../modules/auth/logout.js";
import type { SessionDB } from "../modules/user/types.js";
import { isLocalEnv } from "../utils/env.js";
import { getUserIDFromToken, setAccessToken } from "../modules/auth/utils.js";
import { refreshAuth } from "../modules/auth/refresh.js";

const app = new Hono();

interface RefreshParams {
	userID: string;
	sessionID: string;
}

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

	setAccessToken(ctx, token);

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
app.get("/refresh", async (ctx: Context) => {
	const accessCookie = getCookie(ctx, "access_token");

	if (!accessCookie) {
		const err = new Error("Session cookie not found!");
		const errResp = getResponseError(err, {
			token: null,
			error: err.message,
		});

		return ctx.json(errResp);
	}

	const refreshedAuth = (await refreshAuth(accessCookie)) as RefreshResponse;
	const newToken = refreshedAuth.token;
	console.log("refreshedAuth", refreshedAuth);

	setAccessToken(ctx, newToken);

	const resp = getResponseOk({
		...refreshedAuth,
		error: null,
	});

	return ctx.json(resp);
});

export default app;
