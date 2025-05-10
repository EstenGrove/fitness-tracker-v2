import {
	AllHistory,
	HistoryOfType,
	WalkHistory,
	WorkoutHistory,
} from "../features/history/types";
import { Activity } from "../features/shared/types";
import { AsyncResponse } from "../features/types";
import { ExerciseSet, WalkWorkout, Workout } from "../features/workouts/types";
import { currentEnv, historyApis } from "./utils_env";
import { formatThousand } from "./utils_misc";
import { fetchWithAuth } from "./utils_requests";

export type AllHistoryResp = AsyncResponse<AllHistory>;
export type HistoryTypeResp = AsyncResponse<{ history: WorkoutHistory[] }>;

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

export {
	fetchHistoryByRange,
	fetchHistoryByRangeAndActivity,
	getKcals,
	getSteps,
	getMiles,
	getPace,
	getTotalMins,
	getTotalCalories,
	getExerciseFromSets,
};
