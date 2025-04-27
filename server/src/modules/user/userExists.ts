import { userService } from "../../services/index.ts";

const userExists = async (username: string, password: string) => {
	if (!username || !password) return false;

	const existsResp = (await userService.userExists(username, password)) as {
		is_active_user: boolean;
	};
	const isActiveUser = existsResp.is_active_user;

	return isActiveUser;
};

export { userExists };
