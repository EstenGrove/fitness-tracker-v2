import { Activity } from "../features/shared/types";
import { PostWorkoutStats } from "../features/stats/types";
import { AsyncResponse } from "../features/types";
import { currentEnv, statsApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

interface PostWorkoutParams {
	userID: string;
	historyID: number;
	workoutID: number;
	activityType: Activity;
}

export type PostWorkoutResp = AsyncResponse<PostWorkoutStats>;

const getPostWorkoutStats = async (
	params: PostWorkoutParams
): PostWorkoutResp => {
	const { userID, historyID, workoutID, activityType } = params;
	let url = currentEnv.base + statsApis.getPostWorkoutStats;
	url += "?" + new URLSearchParams({ userID, activityType });
	url += "&" + new URLSearchParams({ historyID: String(historyID) });
	url += "&" + new URLSearchParams({ workoutID: String(workoutID) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

export { getPostWorkoutStats };
