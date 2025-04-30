import { authService, userService } from "../../services/index.ts";
import type { Session, SessionDB, User, UserDB } from "../user/types.ts";
import { normalizeLoginData } from "./normalize.ts";
import type { RefreshResp } from "./types.ts";
import { generateAccessToken, getUserIDFromToken } from "./utils.ts";

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
