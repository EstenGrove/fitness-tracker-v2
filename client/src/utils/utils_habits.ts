import { Habit, HabitLog } from "../features/habits/types";
import { AsyncResponse } from "../features/types";
import { currentEnv, habitApis } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export type HabitsResp = AsyncResponse<{ habits: Habit[] }>;
export type HabitLogsResp = AsyncResponse<{ logs: HabitLog[] }>;

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

export { fetchHabits, fetchHabitLogs, fetchHabitSummaries, habitIcons };
