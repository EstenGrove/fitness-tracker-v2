export interface UserDB {
	user_id: string;
	username: string;
	password: string;
	first_name: string;
	last_name: string;
	is_active: boolean;
	created_date: string;
	last_login_date: string | null;
	user_avatar: string | null;
}
export interface User {
	userID: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	isActive: boolean;
	createdDate: string;
	lastLoginDate: string | null;
	userAvatar: string | null;
}

export interface SessionDB {
	user_id: string;
	session_id: string;
	session_start: string;
	session_end: string;
	is_active: boolean;
	session_token: string;
	last_updated: string;
}
export interface Session {
	userID: string;
	sessionID: string;
	sessionStart: string;
	sessionEnd: string;
	isActive: boolean;
	sessionToken: string;
	lastUpdated: string;
}
