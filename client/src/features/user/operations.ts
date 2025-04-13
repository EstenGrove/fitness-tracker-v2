import { createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "../../utils/utils_user";
import {
	fetchUserByID,
	fetchUserByLogin,
	UserResponse,
} from "../../utils/utils_user";
import { AwaitedResponse } from "../types";

const logoutUser = createAsyncThunk(
	"user/logoutUser",
	async (userID: string) => {
		const logoutResp = await logout(userID);
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

export { logoutUser, getUserByLogin, getUserByID };
