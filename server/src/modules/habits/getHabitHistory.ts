import type { HabitHistoryResp } from "../../services/HabitsService.js";
import { habitsService } from "../../services/index.js";
import type { HabitHistory, HabitHistoryDB } from "./types.js";

const normalizeHabitHistory = (history: HabitHistoryDB): HabitHistory => {
	if (!history || !history.length) return [];
	const newHistory: HabitHistory = history.map((entry) => ({
		date: entry.date,
		habitID: entry.habit_id,
		habitTarget: entry.target_value,
		habitValue: entry.total_logged,
		reachedGoal: entry.reached_goal,
		percentage: entry.percentage,
	}));

	return newHistory;
};

const getHabitHistory = async (
	userID: string,
	habitID: number,
	lastXDays: number = 60
) => {
	const results = (await habitsService.getHabitHistory(
		userID,
		habitID,
		lastXDays
	)) as HabitHistoryDB;

	if (results instanceof Error) {
		return results;
	}

	const history: HabitHistory = normalizeHabitHistory(results);

	return history;
};

export { normalizeHabitHistory, getHabitHistory };
