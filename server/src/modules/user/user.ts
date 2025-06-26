import type { Session, SessionDB, User, UserDB } from "./types.js";

const normalizeUser = (user: UserDB): User => {
	const client: User = {
		userID: user.user_id,
		username: user.username,
		password: user.password,
		firstName: user.first_name,
		lastName: user.last_name,
		isActive: user.is_active,
		createdDate: user.created_date,
		lastLoginDate: user.last_login_date,
		userAvatar: user.user_avatar,
	};
	return client;
};
const normalizeSession = (session: SessionDB): Session => {
	const client: Session = {
		userID: session.user_id,
		sessionID: session.session_id,
		sessionStart: session.session_start,
		sessionEnd: session.session_end,
		sessionToken: session.session_token,
		isActive: session.is_active,
		lastUpdated: session.last_updated,
	};
	return client;
};

export { normalizeUser, normalizeSession };
