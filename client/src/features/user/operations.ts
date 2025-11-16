import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	AuthRefreshResponse,
	fetchUserExists,
	getRefreshAuth,
	login,
	LoginResponse,
	logout,
	UserExistsResponse,
} from "../../utils/utils_user";
import {
	fetchUserByID,
	fetchUserByLogin,
	UserResponse,
} from "../../utils/utils_user";
import { AwaitedResponse } from "../types";
import { loginWithGoogle } from "../../utils/utils_auth";

interface LoginParams {
	username: string;
	password: string;
}

interface LoginWithGoogleParams {
	token: string;
}
interface SessionParams {
	userID: string;
	sessionID: string;
}

const logoutUser = createAsyncThunk(
	"user/logoutUser",
	async (params: SessionParams) => {
		const { userID, sessionID } = params;
		const logoutResp = await logout(userID, sessionID);
		const data = logoutResp.Data;
		return data;
	}
);
const loginUser = createAsyncThunk(
	"user/loginUser",
	async (params: LoginParams) => {
		const { username, password } = params;
		const loginResp = (await login(
			username,
			password
		)) as AwaitedResponse<LoginResponse>;
		const data = loginResp.Data as LoginResponse;
		return data as LoginResponse;
	}
);

const loginUserWithGoogle = createAsyncThunk(
	"user/loginUserWithGoogle",
	async (params: LoginWithGoogleParams) => {
		const { token } = params;
		const loginResp = (await loginWithGoogle(
			token
		)) as AwaitedResponse<LoginResponse>;
		const data = loginResp.Data as LoginResponse;
		return data as LoginResponse;
	}
);

interface LoginParams {
	username: string;
	password: string;
}

const getUserByLogin = createAsyncThunk(
	"user/getUserByLogin",
	async (params: LoginParams) => {
		const response = (await fetchUserByLogin(
			params.username,
			params.password
		)) as AwaitedResponse<UserResponse>;

		const data = response.Data;

		return data as UserResponse;
	}
);

const getUserByID = createAsyncThunk(
	"user/getUserByID",
	async (userID: string) => {
		const response = (await fetchUserByID(
			userID
		)) as AwaitedResponse<UserResponse>;
		const data = response.Data;

		return data as UserResponse;
	}
);

const refreshAuth = createAsyncThunk(
	"user/refreshAuth",
	async (userID?: string) => {
		const response = (await getRefreshAuth(
			userID
		)) as AwaitedResponse<AuthRefreshResponse>;
		const data = response.Data;
		return data as AuthRefreshResponse;
	}
);

const userExists = createAsyncThunk(
	"user/userExists",
	async (params: LoginParams) => {
		const { username, password } = params;
		const response = (await fetchUserExists(
			username,
			password
		)) as AwaitedResponse<UserExistsResponse>;
		const data = response.Data as UserExistsResponse;

		return data as UserExistsResponse;
	}
);

export {
	loginUser,
	logoutUser,
	refreshAuth,
	getUserByLogin,
	getUserByID,
	userExists,
	loginUserWithGoogle,
};
