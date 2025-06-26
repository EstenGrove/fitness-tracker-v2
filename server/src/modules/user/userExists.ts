import { userService } from "../../services/index.js";

export interface UserExistsDB {
	is_active_user: boolean;
	invalid_creds: boolean;
	user_not_found: boolean;
}
export interface UserExists {
	isActiveUser: boolean;
	invalidCreds: boolean;
	userNotFound: boolean;
}

const userExists = async (
	username: string,
	password: string
): Promise<UserExists | unknown> => {
	if (!username || !password) return false;

	const existsResp = (await userService.userExists(
		username,
		password
	)) as UserExistsDB;

	console.log("existsResp", existsResp);

	return {
		isActiveUser: existsResp.is_active_user,
		userNotFound: existsResp.user_not_found,
		invalidCreds: existsResp.invalid_creds,
	};
};

export { userExists };
