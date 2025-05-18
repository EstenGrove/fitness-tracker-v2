import {
	EHabitStatus,
	Habit,
	HabitDetails,
	HabitIntent,
	HabitLog,
	HabitLogValues,
} from "../features/habits/types";
import { AsyncResponse } from "../features/types";
import { currentEnv, habitApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export interface HabitDetailParams {
	userID: string;
	habitID: number;
	targetDate: string;
}

export type LoggedHabitResp = AsyncResponse<{ newLog: HabitLog }>;
export type HabitsResp = AsyncResponse<{ habits: Habit[] }>;
export type HabitLogsResp = AsyncResponse<{ logs: HabitLog[] }>;
export type HabitDetailsResp = AsyncResponse<HabitDetails>;

const fetchHabits = async (userID: string, targetDate: string): HabitsResp => {
	let url = currentEnv.base + habitApis.getHabits;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const fetchHabitLogs = async (
	userID: string,
	habitID: number
): HabitLogsResp => {
	let url = currentEnv.base + habitApis.getHabitLogs;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ habitID: String(habitID) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const fetchHabitSummaries = async (userID: string, targetDate: string) => {
	let url = currentEnv.base + habitApis.getHabits;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const fetchHabitDetails = async (
	userID: string,
	params: Omit<HabitDetailParams, "userID">
): HabitDetailsResp => {
	const { habitID, targetDate } = params;
	let url = currentEnv.base + habitApis.getHabitDetails;
	url += "?" + new URLSearchParams({ userID, targetDate });
	url += "&" + new URLSearchParams({ habitID: String(habitID) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const logHabit = async (log: HabitLogValues): LoggedHabitResp => {
	const url = currentEnv.base + habitApis.logHabit;

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify(log),
		});
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const logHabitsBatched = async (userID: string, logs: HabitLogValues[]) => {
	let url = currentEnv.base + habitApis.logHabitsBatched;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({
				newLogs: logs,
			}),
		});
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const getBuildStatus = (currentValue: number, targetValue: number) => {
	switch (true) {
		case !currentValue || currentValue === 0:
			return EHabitStatus.NONE;
		case currentValue < targetValue:
			return EHabitStatus.BELOW;
		case currentValue === targetValue:
			return EHabitStatus.OK;
		default:
			return EHabitStatus.ABOVE;
	}
};
const getReduceStatus = (currentValue: number, targetValue: number) => {
	switch (true) {
		case !currentValue || currentValue === 0:
			return EHabitStatus.NONE;
		case currentValue < targetValue:
			return EHabitStatus.ABOVE;
		case currentValue === targetValue:
			return EHabitStatus.OK;
		default:
			return EHabitStatus.OVER;
	}
};
const getEliminateStatus = (currentValue: number, targetValue: number) => {
	switch (true) {
		case !currentValue:
			return EHabitStatus.NONE;
		case currentValue === targetValue:
			return EHabitStatus.OK;
		default:
			return EHabitStatus.OVER;
	}
};
const getLapseStatus = (currentValue: number) => {
	switch (true) {
		case !currentValue:
			return EHabitStatus.NONE;
		case currentValue === 0:
			return EHabitStatus.OK;
		default:
			return EHabitStatus.LAPSED;
	}
};

const determineHabitStatus = (
	intent: HabitIntent,
	currentValue: number,
	targetValue: number
) => {
	switch (intent) {
		case "BUILD": {
			return getBuildStatus(currentValue, targetValue);
		}
		case "ELIMINATE": {
			return getEliminateStatus(currentValue, targetValue);
		}
		case "REDUCE": {
			return getReduceStatus(currentValue, targetValue);
		}
		case "LAPSE": {
			return getLapseStatus(currentValue);
		}

		default:
			throw new Error(`Invalid 'INTENT': ${intent}`);
	}
};

const habitIcons = {
	smoke: "no-smoking",
	smoke2: "no-smoking-2",
	smoke3: "no-smoking-3",
	smoke4: "no-smoking-4",
	water: "water",
	water2: "water-2",
	water3: "water-3",
	water4: "water-4",
	water5: "water-5",
	drinkWater: "bottle-of-water",
	drinkWater2: "bottle-of-water-2",
	coffee: "coffee",
	coffee2: "coffee-2",
} as const;

export {
	fetchHabits,
	fetchHabitLogs,
	fetchHabitDetails,
	fetchHabitSummaries,
	logHabit,
	logHabitsBatched,
	// Habit Icons
	habitIcons,
	// Habit Status
	getBuildStatus,
	getEliminateStatus,
	getReduceStatus,
	getLapseStatus,
	determineHabitStatus,
};
