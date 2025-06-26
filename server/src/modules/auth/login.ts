import { authService, userService } from "../../services/index.js";
import type { UserDB } from "../user/types.js";
import type { LoggedInDB } from "./types.js";
import { generateAccessToken } from "./utils.js";

const login = async (username: string, password: string) => {
	const existingUser = (await userService.getUserByLogin(
		username,
		password
	)) as UserDB;

	if (!existingUser || existingUser instanceof Error) {
		return new Error("User not found");
	}

	const userID = existingUser.user_id;
	const token = (await generateAccessToken({ userID })) as string;

	const loginData = (await authService.login(
		username,
		password,
		token
	)) as LoggedInDB;

	return {
		token: token,
		currentUser: loginData.currentUser,
		currentSession: loginData.currentSession,
	};
};

export { login };
