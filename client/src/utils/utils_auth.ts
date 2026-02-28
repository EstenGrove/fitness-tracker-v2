import { JWTAccessPayload } from "../features/auth/types";
import { AsyncResponse } from "../features/types";
import { CurrentSession, CurrentUser } from "../features/user/types";
import { authApis, currentEnv } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export interface AuthData {
	token: string;
	user: CurrentUser;
	session: CurrentSession;
}

export type AuthResp = AsyncResponse<AuthData>;

// '/auth/google' to grab the user, set the user's session and return the data
const loginWithGoogle = async (token: string): AuthResp => {
	const url = currentEnv.base + authApis.googleLogin;

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({
				token: token,
			}),
		});
		const response = await request.json();
		console.log("RESPONSE:", response);
		return response as AuthData;
	} catch (error) {
		return error;
	}
};

const signupWithGoogle = async (token: string) => {
	const url = currentEnv.base + authApis.googleSignup;
	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({
				token: token,
			}),
		});
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

// Parses token payload into readable JWTAccessPayload interface
const getTokenPayload = (token: string): JWTAccessPayload | null => {
	if (!token) return null;
	try {
		const payload = JSON.parse(atob(token.split(".")[1])) as JWTAccessPayload;
		return payload;
	} catch {
		return null;
	}
};

const getTokenExpiry = (token: string): number | null => {
	if (!token) return null;

	try {
		const payload = getTokenPayload(token) as JWTAccessPayload;
		return payload.exp * 1000; // convert to ms
	} catch {
		return null;
	}
};

const isTokenExpired = (token: string): boolean => {
	const expiry = getTokenExpiry(token);
	if (!expiry) return true;
	return Date.now() >= expiry;
};

export {
	loginWithGoogle,
	signupWithGoogle,
	getTokenExpiry,
	isTokenExpired,
	getTokenPayload,
};
