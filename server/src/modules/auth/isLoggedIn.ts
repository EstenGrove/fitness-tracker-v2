import { authService } from "../../services/index.js";
import type { IsLoggedInDB } from "./types.js";

const isLoggedIn = async (userID: string, date: string): Promise<boolean> => {
	if (!userID) {
		return false;
	}

	const data = (await authService.isLoggedIn(userID, date)) as IsLoggedInDB;

	if (!data || data instanceof Error) {
		return false;
	}

	return data.is_logged_in as boolean;
};

export { isLoggedIn };
