export interface CurrentUser {
	userID: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	userAvatar: string | null;
	isActive: boolean;
	createdDate: string;
	lastLoginDate: string | null;
	token: string | null;
}

export interface CurrentSession {
	token: string;
	userID: string;
	sessionID: string;
	expiry: string;
	lastRefreshedDate: string;
}
