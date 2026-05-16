import { Activity } from "../features/shared/types";
import { RangeParams } from "../features/types";
import { currentEnv, metricsApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export type ActivityMetricsAfterParams = {
	activityType: Activity;
	workoutID: number;
	historyID: number;
	range: RangeParams;
};

const fetchActivityMetricsAfterWorkout = async (
	userID: string,
	params: ActivityMetricsAfterParams,
) => {
	const { activityType, workoutID, historyID, range } = params;
	const { startDate, endDate } = range;
	let url = currentEnv.base + metricsApis.getActivityMetricsAfterWorkout;
	url += "?" + new URLSearchParams({ userID, activityType });
	url += "&" + new URLSearchParams({ startDate, endDate });
	url +=
		"&" +
		new URLSearchParams({
			workoutID: String(workoutID),
			historyID: String(historyID),
		});

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

export { fetchActivityMetricsAfterWorkout };
