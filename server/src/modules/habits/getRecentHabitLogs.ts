import type { RecentHabitParams } from "../../services/HabitsService.ts";
import { habitsService } from "../../services/index.ts";
import type { RecentHabitLog, RecentHabitLogDB } from "./types.ts";

const getRecentHabitLogs = async (
	userID: string,
	params: RecentHabitParams
) => {
	const recents = (await habitsService.getRecentHabitLogs(
		userID,
		params
	)) as RecentHabitLogDB[];

	if (recents instanceof Error) {
		return recents;
	}

	const recentLogs = normalizeRecentHabitLogs(recents);

	return recentLogs;
};

const normalizeRecentHabitLogs = (
	logs: RecentHabitLogDB[]
): RecentHabitLog[] => {
	if (!logs || !logs.length) return [];

	const newLogs: RecentHabitLog[] = logs.map((log) => ({
		logID: log.log_id,
		habitID: log.habit_id,
		habitName: log.habit_name,
		intent: log.intent,
		frequency: log.frequency,
		habitTarget: log.target_value,
		habitUnit: log.target_unit,
		unitDesc: log.unit_desc,
		logTime: log.log_time,
		loggedValue: log.logged_value,
		notes: log.notes,
		icon: log.icon,
		iconColor: log.icon_color,
		createdDate: log.created_date,
	}));

	return newLogs;
};

export { normalizeRecentHabitLogs, getRecentHabitLogs };
