import { Activity } from "../features/shared/types";
import { currentEnv, workoutRecapApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export interface WorkoutRecapParams {
	userID: string;
	activityType: Activity;
	workoutID: number;
	lastXDays?: number;
}

const fetchWorkoutRecap = async (
	userID: string,
	params: WorkoutRecapParams
) => {
	const { activityType, workoutID, lastXDays = 30 } = params;
	let url = currentEnv.base + workoutRecapApis.getWorkoutRecap;
	url += "?" + new URLSearchParams({ userID, activityType });
	url += "&" + new URLSearchParams({ workoutID: String(workoutID) });
	url += "&" + new URLSearchParams({ lastXDays: String(lastXDays) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

export { fetchWorkoutRecap };
