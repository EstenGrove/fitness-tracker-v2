import { habitsService } from "../../services/index.js";
import { normalizeHabit, normalizeHabitLog } from "./getUserHabits.js";
import type {
	Habit,
	HabitHistoryForRange,
	HabitHistoryForRangeDB,
} from "./types.js";

export interface HabitHistoryForRangeParams {
	userID: string;
	habitID: number;
	startDate: string;
	endDate: string;
}

const getHabitHistoryForRange = async (params: HabitHistoryForRangeParams) => {
	const { userID, habitID, startDate, endDate } = params;

	const historyData = (await habitsService.getHabitHistoryForRange(
		userID,
		habitID,
		startDate,
		endDate
	)) as HabitHistoryForRangeDB;

	if (historyData instanceof Error) {
		return historyData;
	}

	const { habit, history, summary } = historyData;
	const newHabit = normalizeHabit(habit);
	const newHistory = history?.map(normalizeHabitLog);
	const newSummary = summary?.[0];

	const data: HabitHistoryForRange = {
		habit: newHabit,
		history: newHistory,
		summary: newSummary,
	};

	return data;
};

export { getHabitHistoryForRange };
