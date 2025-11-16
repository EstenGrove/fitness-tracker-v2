import { authService, userService } from "../../services/index.js";
import type { UserDB } from "../user/types.js";
import type { LoginDataDB, LoginRespDB } from "./login.js";
import type { LoggedInDB } from "./types.js";
import { generateAccessToken } from "./utils.js";

const loginWithGoogle = async (googleID: string): LoginRespDB => {
	const existingUser = (await userService.getUserByGoogleID(
		googleID
	)) as UserDB;

	if (!existingUser || existingUser instanceof Error) {
		return new Error("User not found");
	}

	const userID = existingUser.user_id;
	const password = existingUser.password;
	const username = existingUser.username;
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
	} as LoginDataDB;
};

export { loginWithGoogle };
