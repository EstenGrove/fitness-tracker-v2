import { Activity, RepeatType } from "../features/shared/types";
import {
	PostWorkoutStats,
	PostWorkoutDetails,
	WorkoutStats,
	WorkoutStatsParams,
	MinsSummaryItem,
	TimeKey,
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
export type MinsSummaryRangeResp<T extends TimeKey> = AsyncResponse<{
	summary: MinsSummaryItem<T>[];
}>;

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
const getDailyMinsSummary = async (
	userID: string,
	targetDate: string
): MinsSummaryRangeResp<"day"> => {
	let url = currentEnv.base + statsApis.getDailyMinsSummary;
	url += "?" + new URLSearchParams({ userID, targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response.Data;
	} catch (error) {
		return error;
	}
};
const getWeeklyMinsSummary = async (
	userID: string,
	targetDate: string
): MinsSummaryRangeResp<"week"> => {
	let url = currentEnv.base + statsApis.getWeeklyMinsSummary;
	url += "?" + new URLSearchParams({ userID, targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response.Data;
	} catch (error) {
		return error;
	}
};
const getMonthlyMinsSummary = async (
	userID: string,
	targetDate: string
): MinsSummaryRangeResp<"month"> => {
	let url = currentEnv.base + statsApis.getMonthlyMinsSummary;
	url += "?" + new URLSearchParams({ userID, targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response.Data;
	} catch (error) {
		return error;
	}
};
const getYearlyMinsSummary = async (
	userID: string,
	targetDate: string
): MinsSummaryRangeResp<"year"> => {
	let url = currentEnv.base + statsApis.getYearlyMinsSummary;
	url += "?" + new URLSearchParams({ userID, targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response.Data;
	} catch (error) {
		return error;
	}
};
const getMinsSummaryForRange = async (
	userID: string,
	targetDate: string,
	rangeType: Omit<RepeatType, "None"> = "Weekly"
) => {
	switch (rangeType) {
		case "Daily": {
			const resp = await getDailyMinsSummary(userID, targetDate);
			return resp;
		}
		case "Weekly": {
			const resp = await getWeeklyMinsSummary(userID, targetDate);
			return resp;
		}
		case "Monthly": {
			const resp = await getMonthlyMinsSummary(userID, targetDate);
			return resp;
		}
		case "Yearly": {
			const resp = await getYearlyMinsSummary(userID, targetDate);
			return resp;
		}

		default:
			throw new Error("Invalid range type: " + rangeType);
	}
};

export {
	getPostWorkoutStats,
	getWorkoutStats,
	getPostWorkoutDetails,
	getMonthlyMinsSummary,
	getMinsSummaryForRange,
};
