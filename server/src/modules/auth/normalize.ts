import { normalizeSession, normalizeUser } from "../user/user.ts";
import type { LoggedIn, LoggedInDB } from "./types.ts";

const normalizeLoginData = (data: LoggedInDB): LoggedIn => {
	const user = normalizeUser(data.currentUser);
	const session = normalizeSession(data.currentSession);

	return {
		currentSession: session,
		currentUser: user,
	};
};

export { normalizeLoginData };
