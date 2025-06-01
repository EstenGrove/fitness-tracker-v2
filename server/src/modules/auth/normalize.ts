import { normalizeSession, normalizeUser } from "../user/user.js";
import type { LoggedIn, LoggedInDB } from "./types.js";

const normalizeLoginData = (data: LoggedInDB): LoggedIn => {
	const user = normalizeUser(data.currentUser);
	const session = normalizeSession(data.currentSession);

	return {
		currentSession: session,
		currentUser: user,
	};
};

export { normalizeLoginData };
