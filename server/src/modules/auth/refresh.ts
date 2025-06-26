import { authService, userService } from "../../services/index.js";
import type { SessionDB, UserDB } from "../user/types.js";
import { normalizeLoginData } from "./normalize.js";
import type { RefreshResp } from "./types.js";
import { generateAccessToken, getUserIDFromToken } from "./utils.js";

const refreshAuth = async (token: string): RefreshResp => {
	if (!token) return new Error("Invalid token :" + token);
	const userID = (await getUserIDFromToken(token)) as string;

	if (!userID) return new Error("No userID in token: " + token);

	const newToken = await generateAccessToken({ userID });
	const activeSession = (await authService.getActiveSession(
		userID
	)) as SessionDB;
	const activeUser = (await userService.getUserByID(userID)) as UserDB;

	const refreshedData = normalizeLoginData({
		currentSession: activeSession,
		currentUser: activeUser,
	});

	return {
		token: newToken,
		currentUser: refreshedData.currentUser,
		currentSession: refreshedData.currentSession,
	};
};

export { refreshAuth };
