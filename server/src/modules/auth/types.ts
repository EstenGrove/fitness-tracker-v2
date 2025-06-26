import type { Session, SessionDB, User, UserDB } from "../user/types.js";

export interface LoginParams {
	username: string;
	password: string;
	rememberMe?: boolean;
}
export interface LogoutParams {
	userID: string;
	sessionID: string;
}

export interface JWTAccessPayload {
	userID: string;
}
export interface JWTRefreshPayload {
	userID: string;
	sessionID: string;
}

export interface LoggedInDB {
	currentUser: UserDB;
	currentSession: SessionDB;
}

export interface LoggedIn {
	currentUser: User;
	currentSession: Session;
}
export interface LoggedOutDB {
	currentUser: UserDB;
	currentSession: SessionDB;
}

export interface LoggedOut {
	currentUser: User;
	currentSession: Session;
}

export interface IsLoggedInDB {
	user_id: string;
	date: string;
	is_logged_in: boolean;
}

export interface RefreshResponse {
	currentUser: User;
	currentSession: Session;
	token: string;
}
export type RefreshResp = Promise<RefreshResponse | unknown>;
