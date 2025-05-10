import { Activity } from "../features/shared/types";
import {
	PostWorkoutStats,
	PostWorkoutDetails,
	WorkoutStats,
	WorkoutStatsParams,
} from "../features/stats/types";
import { AsyncResponse } from "../features/types";
import { currentEnv, statsApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

interface PostWorkoutParams {
	userID: string;
	workoutID: number;
	activityType: Activity;
}

export type PostWorkoutResp = AsyncResponse<PostWorkoutStats>;
export type WorkoutStatsResp = AsyncResponse<WorkoutStats>;
export type PostWorkoutDetailsResp = AsyncResponse<PostWorkoutDetails>;

const getPostWorkoutDetails = async (
	params: PostWorkoutParams
): PostWorkoutDetailsResp => {
	const { workoutID } = params;
	let url = currentEnv.base + statsApis.getPostWorkoutDetails;
	url += "?" + new URLSearchParams({ ...params, workoutID: String(workoutID) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const getPostWorkoutStats = async (
	params: PostWorkoutParams
): PostWorkoutResp => {
	const { userID, workoutID, activityType } = params;
	let url = currentEnv.base + statsApis.getPostWorkoutStats;
	url += "?" + new URLSearchParams({ userID, activityType });
	// url += "&" + new URLSearchParams({ historyID: String(historyID) });
	url += "&" + new URLSearchParams({ workoutID: String(workoutID) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const getWorkoutStats = async (
	params: WorkoutStatsParams
): WorkoutStatsResp => {
	const { userID, historyID, activityType } = params;
	let url = currentEnv.base + statsApis.getWorkoutStats;
	url += "?" + new URLSearchParams({ userID, activityType });
	url += "&" + new URLSearchParams({ historyID: String(historyID) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

export { getPostWorkoutStats, getWorkoutStats, getPostWorkoutDetails };
