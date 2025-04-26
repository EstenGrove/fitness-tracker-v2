import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout } from "../../utils/utils_user";
import {
	fetchUserByID,
	fetchUserByLogin,
	UserResponse,
} from "../../utils/utils_user";
import { AwaitedResponse } from "../types";

interface LoginParams {
	username: string;
	password: string;
}

const logoutUser = createAsyncThunk(
	"user/logoutUser",
	async (userID: string) => {
		const logoutResp = await logout(userID);
		const data = logoutResp.Data;
		return data;
	}
);
const loginUser = createAsyncThunk(
	"user/loginUser",
	async (params: LoginParams) => {
		const { username, password } = params;
		const logoutResp = await login(username, password);
		const data = logoutResp.Data;
		return data;
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

export { loginUser, logoutUser, getUserByLogin, getUserByID };
