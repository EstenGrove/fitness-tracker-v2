import { AllHistory, WorkoutHistory } from "../features/history/types";
import { Activity } from "../features/shared/types";
import { AsyncResponse, DateRange } from "../features/types";
import { currentEnv, historyApis } from "./utils_env";

export type AllHistoryResp = AsyncResponse<AllHistory>;
export type HistoryTypeResp = AsyncResponse<{ history: WorkoutHistory[] }>;

const fetchHistoryByRange = async (
	userID: string,
	range: DateRange
): AllHistoryResp => {
	let url = currentEnv.base + historyApis.getByRange;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ ...range });

	try {
		const request = await fetch(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

const fetchHistoryByRangeAndActivity = async (
	userID: string,
	activityType: Activity,
	range: DateRange
): HistoryTypeResp => {
	let url = currentEnv.base + historyApis.getByRangeAndActivity;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ activityType });
	url += "&" + new URLSearchParams({ ...range });

	try {
		const request = await fetch(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

export { fetchHistoryByRange, fetchHistoryByRangeAndActivity };
