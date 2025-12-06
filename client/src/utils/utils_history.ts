import {
	AllHistory,
	HistoryDetails,
	HistoryOfType,
	WalkHistory,
	WorkoutHistory,
} from "../features/history/types";
import { Activity } from "../features/shared/types";
import { AsyncResponse } from "../features/types";
import { ExerciseSet, WalkWorkout, Workout } from "../features/workouts/types";
import { currentEnv, historyApis } from "./utils_env";
import {
	formatThousand,
	sortByDateDesc,
	sortByDateOrder,
	sortByNumberOrder,
} from "./utils_misc";
import { fetchWithAuth } from "./utils_requests";

export type AllHistoryResp = AsyncResponse<AllHistory>;
export type HistoryTypeResp = AsyncResponse<{ history: WorkoutHistory[] }>;
export type HistoryDetailsResp = AsyncResponse<HistoryDetails>;

export interface HistoryDetailsParams {
	userID: string;
	historyID: number;
	activityType: Activity;
}
interface DateRangeStr {
	startDate: string;
	endDate: string;
}

const fetchHistoryByRange = async (
	userID: string,
	range: DateRangeStr
): AllHistoryResp => {
	let url = currentEnv.base + historyApis.getByRange;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ ...range });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

const fetchHistoryByRangeAndActivity = async (
	userID: string,
	activityType: Activity,
	range: DateRangeStr
): HistoryTypeResp => {
	let url = currentEnv.base + historyApis.getByRangeAndActivity;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ activityType });
	url += "&" + new URLSearchParams({ ...range });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

const fetchHistoryDetails = async (
	userID: string,
	historyID: number,
	activityType: Activity
): HistoryDetailsResp => {
	let url = currentEnv.base + historyApis.getHistoryDetails;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ activityType });
	url += "&" + new URLSearchParams({ historyID: String(historyID) });
	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

const getTotalMins = (history: HistoryOfType[]) => {
	if (!history || !history.length) return 0;
	const mins = history.reduce((total, item) => (total += item.duration), 0);
	return mins;
};
const getTotalCalories = (history: HistoryOfType[]) => {
	if (!history || !history.length) return 0;
	const mins = history.reduce((total, item) => (total += item.calories), 0);
	return mins;
};

const getKcals = (entry: Workout | WorkoutHistory) => {
	if ("historyID" in entry && "calories" in entry) {
		return entry?.calories?.toFixed(2);
	} else {
		return "N/A";
	}
};

const getSteps = (entry: WalkHistory | WalkWorkout) => {
	if ("steps" in entry) {
		const raw = entry.steps;
		return formatThousand(raw);
	} else {
		return formatThousand(0.0);
	}
};

const getMiles = (entry: WalkHistory | WalkWorkout) => {
	if ("miles" in entry) {
		const mi = Number(entry?.miles ?? "0.00");
		return mi.toFixed(2);
	} else {
		return "0.00";
	}
};
const getPace = (entry: WalkHistory | WalkWorkout) => {
	if ("pace" in entry) {
		const pace = entry.pace;
		return pace;
	} else {
		return `00'00"/mi`;
	}
};

const getExerciseFromSets = (sets: ExerciseSet[], fallback: string = "") => {
	if (!sets || !sets.length) return fallback;
	const item = sets[0];
	return item?.exercise ?? fallback;
};

export type SortHistoryBy = {
	by: "workoutDate" | "startTime" | "duration";
	order: "ASC" | "DESC";
};

const defaultSort: SortHistoryBy = {
	by: "workoutDate",
	order: "DESC", // recent to oldest
};

const sortHistoryBy = (
	history: Array<WorkoutHistory | HistoryOfType>,
	sort: SortHistoryBy = defaultSort
) => {
	const { by, order } = sort;
	switch (by) {
		case "workoutDate": {
			const sorted = sortByDateOrder("workoutDate", history, order);
			return sorted;
		}
		case "startTime": {
			const sorted = sortByDateOrder("startTime", history, order);
			return sorted;
		}
		case "duration": {
			const sorted = sortByNumberOrder("duration", history, order);
			return sorted;
		}
		default:
			return history;
	}
};

export {
	fetchHistoryDetails,
	fetchHistoryByRange,
	fetchHistoryByRangeAndActivity,
	getKcals,
	getSteps,
	getMiles,
	getPace,
	getTotalMins,
	getTotalCalories,
	getExerciseFromSets,
	sortHistoryBy,
};
