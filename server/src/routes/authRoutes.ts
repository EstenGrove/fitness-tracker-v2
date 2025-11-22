import { Hono, type Context } from "hono";
import { getResponseError, getResponseOk } from "../utils/api.js";
import type {
	LoggedIn,
	LoginParams,
	LogoutParams,
	RefreshResponse,
} from "../modules/auth/types.js";
import { login, type LoginDataDB } from "../modules/auth/login.js";
import { normalizeLoginData } from "../modules/auth/normalize.js";
import { getCookie, setCookie } from "hono/cookie";
import { normalizeSession } from "../modules/user/user.js";
import { logout } from "../modules/auth/logout.js";
import type { SessionDB } from "../modules/user/types.js";
import { isLocalEnv } from "../utils/env.js";
import { getUserIDFromToken, setAccessToken } from "../modules/auth/utils.js";
import { refreshAuth } from "../modules/auth/refresh.js";
import {
	verifyGoogleToken,
	type GooglePayload,
} from "../modules/auth/googleAuth.js";
import { loginWithGoogle } from "../modules/auth/loginWithGoogle.js";
import type { TokenPayload } from "google-auth-library";

const app = new Hono();

interface RefreshParams {
	userID: string;
	sessionID: string;
}

app.post("/signup", async (ctx: Context) => {});
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

	const loginData = (await login(username, password)) as LoginDataDB;

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

	if (!userID || !sessionID) {
		const err = new Error("Missing userID or sessionID");
		const errResp = getResponseError(err, {
			wasLoggedOut: false,
			session: null,
		});
		return ctx.json(errResp);
	}
	const logoutData = await logout(userID, sessionID);

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
	console.log("accessToken", accessCookie);

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

	setAccessToken(ctx, newToken);

	const resp = getResponseOk({
		...refreshedAuth,
		error: null,
	});

	return ctx.json(resp);
});
app.post("/google/signin", async (ctx: Context) => {
	const body = await ctx.req.json<{ token: string }>();
	const { token: googleToken } = body;

	const googlePayload = (await verifyGoogleToken(googleToken)) as GooglePayload;

	// Google Signin Failed: account-not-found|invalid-creds|unknown-error
	if (googlePayload instanceof Error) {
		const err = new Error("Google Auth: Could not verify google token");

		const errResp = getResponseError(err, {
			token: null,
			error: err.message,
		});
		return ctx.json(errResp);
	}

	const googleID = googlePayload.googleID;
	const loginData = (await loginWithGoogle(googleID)) as LoginDataDB;

	// Login Failed: user-not-found|invalid-creds
	if (loginData instanceof Error) {
		const err = new Error("Google Auth: Login attempt failed");
		const errResp = getResponseError(err, {
			token: null,
			user: null,
			session: null,
		});
		return ctx.json(errResp);
	}

	const accessToken = loginData.token;
	const { currentUser, currentSession }: LoggedIn =
		normalizeLoginData(loginData);

	const resp = getResponseOk({
		token: accessToken,
		user: currentUser,
		session: currentSession,
	});

	setAccessToken(ctx, accessToken);

	return ctx.json(resp);
});
app.post("/google/signup", async (ctx: Context) => {
	const body = await ctx.req.json<{ token: string }>();
	const { token: googleToken } = body;

	const googlePayload = await verifyGoogleToken(googleToken);

	if (googlePayload instanceof Error) {
		const err = new Error("Google Auth: failed to discover user payload!");

		const errResp = getResponseError(err, {
			token: null,
			error: err.message,
		});
		return ctx.json(errResp);
	}
});

export default app;
