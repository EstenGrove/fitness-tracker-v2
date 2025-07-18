import { authService } from "../../services/index.js";
import type { LoggedOutDB } from "./types.js";

const logout = async (userID: string, sessionID: string) => {
	if (!userID || !sessionID) {
		return new Error("Invalid userID or sessionID");
	}

	const logoutData = (await authService.logout(
		userID,
		sessionID
	)) as LoggedOutDB;

	if (logoutData instanceof Error) {
		return logoutData as Error;
	}

	return {
		currentSession: logoutData.currentSession,
		currentUser: logoutData.currentUser,
	};
};

export { logout };
