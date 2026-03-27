import { formatDate } from "./utils_dates";
import { fetchWithAuth } from "./utils_requests";
import { currentEnv, awardsApis } from "./utils_env";

const fetchWorkoutAwards = async (
	userID: string,
	baseDate: string = formatDate(new Date(), "db"),
) => {
	let url = currentEnv.base + awardsApis.getWorkoutAwards;
	url += "?" + new URLSearchParams({ userID, baseDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const fetchWorkoutAwardsAndStreaks = async (
	userID: string,
	baseDate: string = formatDate(new Date(), "db"),
) => {
	let url = currentEnv.base + awardsApis.getWorkoutAwardsAndStreaks;
	url += "?" + new URLSearchParams({ userID, baseDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

export { fetchWorkoutAwards, fetchWorkoutAwardsAndStreaks };
