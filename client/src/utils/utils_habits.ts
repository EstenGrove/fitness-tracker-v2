import {
	EHabitStatus,
	Habit,
	HabitCard,
	HabitDetails,
	HabitFrequency,
	HabitHistory,
	HabitHistoryDay,
	HabitIntent,
	HabitLog,
	HabitLogValues,
	HabitYearSummary,
	RecentHabitLog,
} from "../features/habits/types";
import { AsyncResponse } from "../features/types";
import { formatDate } from "./utils_dates";
import { currentEnv, habitApis } from "./utils_env";
import { provideFallbackStr } from "./utils_misc";
import { fetchWithAuth } from "./utils_requests";

export type HabitModalType =
	| "CREATE"
	| "EDIT"
	| "DELETE"
	| "VIEW"
	| "LOG"
	| "HISTORY";
export enum EHabitModalType {
	CREATE = "CREATE",
	EDIT = "EDIT",
	DELETE = "DELETE",
	VIEW = "VIEW",
	LOG = "LOG",
	HISTORY = "HISTORY",
}
export interface NewHabitGoalParams {
	userID: string;
	habitID: number;
	newGoal: number;
	newGoalUnit: string;
}

export interface NewHabitGoalData {
	updatedHabit: Habit;
}

export interface HabitDetailParams {
	userID: string;
	habitID: number;
	targetDate: string;
}

export interface NewHabitValues {
	habitName: string;
	habitDesc: string;
	habitTarget: string;
	habitUnit: string;
	intent: HabitIntent | string;
	frequency: HabitFrequency | string;
	startDate: string;
	endDate: string | null;
	icon: string;
	iconColor: string;
}

export interface NewHabitParams extends NewHabitValues {
	userID: string;
}

export interface RecentHabitParams {
	userID: string;
	targetDate: string;
	lastXDays: number;
}

export interface HabitHistoryByRangeParams {
	userID: string;
	habitID: number;
	startDate: string;
	endDate: string;
}

export interface HabitHistoryByRange {
	habit: Habit;
	summary: HabitHistoryDay[];
	history: HabitLog[];
}

export type LoggedHabitResp = AsyncResponse<{ newLog: HabitLog }>;
export type HabitsResp = AsyncResponse<{ habits: Habit[] }>;
export type HabitLogsResp = AsyncResponse<{ logs: HabitLog[] }>;
export type HabitDetailsResp = AsyncResponse<HabitDetails>;
export type HabitCardsResp = AsyncResponse<{ habits: HabitCard[] }>;
export type NewHabitResp = AsyncResponse<{ newHabit: HabitCard }>;
export type RecentHabitLogsResp = AsyncResponse<{
	recentLogs: RecentHabitLog[];
}>;
export type HabitHistoryResp = AsyncResponse<{ history: HabitHistory }>;
export type HabitHistorySummaryResp = AsyncResponse<HabitYearSummary>;
export type HabitHistoryByRangeResp = AsyncResponse<HabitHistoryByRange>;
export type HabitGoalResp = AsyncResponse<NewHabitGoalData>;
export type DeletedHabitResp = AsyncResponse<{ habit: Habit }>;

const fetchHabitCards = async (
	userID: string,
	targetDate: string
): HabitCardsResp => {
	let url = currentEnv.base + habitApis.getHabitCards;
	url += "?" + new URLSearchParams({ userID, targetDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
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
const fetchRecentHabitLogs = async (
	userID: string,
	params: RecentHabitParams
): RecentHabitLogsResp => {
	const { targetDate, lastXDays } = params;
	let url = currentEnv.base + habitApis.getRecentLogs;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ targetDate });
	url += "&" + new URLSearchParams({ lastXDays: String(lastXDays) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};
const fetchHabitHistory = async (
	userID: string,
	habitID: number,
	lastXDays: number = 60
): HabitHistoryResp => {
	let url = currentEnv.base + habitApis.getHabitHistory;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ habitID: String(habitID) });
	url += "&" + new URLSearchParams({ lastXDays: String(lastXDays) });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const fetchHabitHistoryForRange = async (
	userID: string,
	params: HabitHistoryByRangeParams
): HabitHistoryByRangeResp => {
	const { habitID, startDate, endDate } = params;
	let url = currentEnv.base + habitApis.getHabitHistoryForRange;
	url += "?" + new URLSearchParams({ userID });
	url += "&" + new URLSearchParams({ habitID: String(habitID) });
	url += "&" + new URLSearchParams({ startDate, endDate });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const fetchHabitHistorySummary = async (
	userID: string,
	habitID: number,
	year: number = new Date().getFullYear()
): HabitHistorySummaryResp => {
	let url = currentEnv.base + habitApis.getHabitHistorySummary;
	url += "?" + new URLSearchParams({ userID });
	url +=
		"&" + new URLSearchParams({ year: String(year), habitID: String(habitID) });

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
// This works as an override, where u can set a value that's meant to be the final value
// ...the backend will then calculate what the total logged prior & what the diff is to create the override value.
const logHabitOverride = async (log: HabitLogValues): LoggedHabitResp => {
	const url = currentEnv.base + habitApis.logHabitManually;

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({
				newLog: log,
			}),
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
const createHabit = async (
	userID: string,
	newHabit: NewHabitValues
): NewHabitResp => {
	let url = currentEnv.base + habitApis.createHabit;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({
				userID: userID,
				newHabit: newHabit,
			}),
		});
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

// Change habit goal
const saveHabitGoal = async (
	userID: string,
	newGoal: NewHabitGoalParams
): HabitGoalResp => {
	let url = currentEnv.base + habitApis.changeHabitGoal;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: JSON.stringify({
				newGoal: newGoal,
			}),
		});
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const deleteHabit = async (
	userID: string,
	habitID: number
): DeletedHabitResp => {
	let url = currentEnv.base + habitApis.deleteHabit;
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

const prepareNewHabit = (values: NewHabitValues): NewHabitValues => {
	const defaultIcon = "repeat";
	const defaultColor = "var(--blueGrey200)";
	const icon = provideFallbackStr(values.icon, defaultIcon);
	const color = provideFallbackStr(values.iconColor, defaultColor);
	const unit = provideFallbackStr(values.habitUnit, "1 unit");
	const endDate = values.endDate ? formatDate(values.endDate, "db") : null;
	const newVals: NewHabitValues = {
		...values,
		icon: icon,
		iconColor: color,
		habitUnit: unit,
		endDate: endDate,
	};

	return newVals;
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
	coffee2: "espresso-cup",
	mario: "super-mario",
	games: "controller",
	gameController: "controller-2",
	challenge: "person-growth",
	medal: "medal2-third-place",
	paint: "paint-palette",
	draw: "paint-brush",
	write: "pen",
	journal: "saving-book",
	goal: "goal",
	stretching: "stretching",
	coffeeCup: "cup",
	cycle: "circular-arrows",
	read: "reading",
	read2: "read-in-bed",
	travel: "travel-card",
	travel2: "marker-sun",
	bungalow: "bungalow",
	repeat: "synchronize",
} as const;

export {
	createHabit,
	fetchHabits,
	fetchHabitLogs,
	fetchHabitCards,
	fetchHabitDetails,
	fetchHabitHistory,
	fetchHabitSummaries,
	fetchHabitHistorySummary,
	fetchRecentHabitLogs,
	fetchHabitHistoryForRange,
	logHabit,
	logHabitOverride,
	logHabitsBatched,
	saveHabitGoal,
	deleteHabit,
	// Habit Icons
	habitIcons,
	// Habit Status
	getBuildStatus,
	getEliminateStatus,
	getReduceStatus,
	getLapseStatus,
	determineHabitStatus,
	prepareNewHabit,
};
