import type { HabitDetailsResp } from "../../services/HabitsService.ts";
import { habitsService } from "../../services/index.ts";
import { normalizeHabit } from "./getUserHabits.ts";
import { normalizeHabitLog } from "./logHabit.ts";
import type {
	HabitDetailParams,
	HabitDetails,
	HabitDetailsDB,
	HabitSummary,
	HabitSummaryDB,
} from "./types.ts";

const getHabitDetails = async (params: HabitDetailParams) => {
	const details = (await habitsService.getHabitDetails(
		params
	)) as HabitDetailsDB;

	if (details instanceof Error) {
		return details;
	}

	const summaryDetails = normalizeHabitDetails(details);

	return summaryDetails;
};

const normalizeHabitDetails = (details: HabitDetailsDB): HabitDetails => {
	const { summary, habit, allLogs, logsForRange } = details;
	const logs = allLogs.map(normalizeHabitLog);
	const forRange = logsForRange.map(normalizeHabitLog);
	const habitEntry = normalizeHabit(habit);
	const habitSummary = normalizeHabitSummary(summary);

	return {
		allLogs: logs,
		logsForRange: forRange,
		summary: habitSummary,
		habit: habitEntry,
	};
};

const normalizeHabitSummary = (summary: HabitSummaryDB): HabitSummary => {
	const client: HabitSummary = {
		startDate: summary.start_date,
		endDate: summary.end_date,
		habitGoal: summary.habit_goal,
		habitIntent: summary.habit_intent,
		habitStatus: summary.habit_status,
		maxStreak: summary.max_streak,
		totalLogged: summary.total_logged,
	};

	return client;
};

export { normalizeHabitSummary, normalizeHabitDetails, getHabitDetails };
