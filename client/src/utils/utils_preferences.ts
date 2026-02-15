import { Preferences } from "../features/preferences/types";
import { AsyncResponse, AwaitedResponse } from "../features/types";
import { currentEnv, preferencesApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export type PreferencesResp = AsyncResponse<Preferences>;

const fetchPreferences = async (userID: string): PreferencesResp => {
	let url = currentEnv.base + preferencesApis.getPreferences;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url);
		const response = (await request.json()) as AwaitedResponse<PreferencesResp>;
		return response;
	} catch (error) {
		return error;
	}
};

export { fetchPreferences };
