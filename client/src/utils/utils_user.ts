import { AsyncResponse } from "../features/types";
import { CurrentSession, CurrentUser } from "../features/user/types";
import { apiEndpoints, currentEnv, authApis, userApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export type UserResponse = {
	error: string | null;
	user: CurrentUser;
	session: CurrentSession | null;
};
export interface LoginResponse {
	user: CurrentUser | null;
	session: CurrentSession | null;
	token: string | null;
	error: string | null;
}
export interface UserExistsResponse {
	isActiveUser: boolean;
	userNotFound: boolean;
	invalidCreds: boolean;
}
export interface AuthRefreshResponse {
	currentUser: CurrentUser | null;
	currentSession: CurrentSession | null;
	token: string | null;
	error: string | null;
}

export type LoginResp = AsyncResponse<LoginResponse>;
export type UserExistsResp = AsyncResponse<UserExistsResponse>;
export type AuthRefreshResp = AsyncResponse<AuthRefreshResponse>;

const login = async (username: string, password: string): LoginResp => {
	const url = currentEnv.base + authApis.login;

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({
				username,
				password,
			}),
		});
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};
const logout = async (userID: string, sessionID: string) => {
	let url = currentEnv.base + authApis.logout;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ sessionID });

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({
				userID,
				sessionID,
			}),
		});
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const getRefreshAuth = async (userID?: string): AuthRefreshResp => {
	let url = currentEnv.base + authApis.refresh;

	if (userID) {
		url += "?" + new URLSearchParams({ userID });
	}

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const fetchUserExists = async (
	username: string,
	password: string
): UserExistsResp => {
	let url = currentEnv.base + userApis.userExists;
	url += "?" + new URLSearchParams({ username, password });

	console.log("url", url);

	try {
		const request = await fetch(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const fetchUserByLogin = async (
	username: string,
	password: string
): AsyncResponse<UserResponse> => {
	const url = currentEnv.base + apiEndpoints.user.getByLogin;

	try {
		const request = await fetch(url, {
			method: "POST",
			body: JSON.stringify({
				username,
				password,
			}),
		});
		const response = await request.json();

		return response as UserResponse;
	} catch (error) {
		return error;
	}
};
const fetchUserByID = async (userID: string): AsyncResponse<UserResponse> => {
	let url = currentEnv.base + apiEndpoints.user.getByLogin;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetch(url);
		const response = await request.json();

		return response as UserResponse;
	} catch (error) {
		return error;
	}
};

export {
	logout,
	login,
	getRefreshAuth,
	fetchUserByLogin,
	fetchUserByID,
	fetchUserExists,
};
