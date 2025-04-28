import { authService, userService } from "../../services/index.ts";
import type { SessionDB, UserDB } from "../user/types.ts";
import { normalizeLoginData } from "./normalize.ts";
import { getUserIDFromToken, verifyAccessToken } from "./utils.ts";

const refreshAuth = async (token: string) => {
	if (!token) return new Error("Invalid token :" + token);
	const userID = (await getUserIDFromToken(token)) as string;
	const activeSession = (await authService.getActiveSession(
		userID
	)) as SessionDB;
	const activeUser = (await userService.getUserByID(userID)) as UserDB;

	const refreshedData = normalizeLoginData({
		currentSession: activeSession,
		currentUser: activeUser,
	});

	return {
		token: token,
		currentUser: refreshedData.currentUser,
		currentSession: refreshedData.currentSession,
	};
};

export { refreshAuth };
