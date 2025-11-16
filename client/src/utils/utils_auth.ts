import { AsyncResponse } from "../features/types";
import { CurrentSession, CurrentUser } from "../features/user/types";
import { authApis, currentEnv } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export interface AuthData {
	token: string;
	user: CurrentUser;
	session: CurrentSession;
}

export type AuthResp = AsyncResponse<AuthData>;

// '/auth/google' to grab the user, set the user's session and return the data
const loginWithGoogle = async (token: string): AuthResp => {
	const url = currentEnv.base + authApis.googleLogin;

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({
				token: token,
			}),
		});
		const response = await request.json();
		console.log("RESPONSE:", response);
		return response as AuthData;
	} catch (error) {
		return error;
	}
};

export { loginWithGoogle };
