import type { LoggedHabitResp } from "../../services/HabitsService.ts";
import { habitsService } from "../../services/index.ts";
import type { HabitLog, HabitLogDB, HabitLogValues } from "./types.ts";

const logHabit = async (logVals: HabitLogValues) => {
	const newLog = (await habitsService.logHabit(logVals)) as HabitLogDB;

	if (newLog instanceof Error) {
		return newLog;
	}

	const createdLog = normalizeHabitLog(newLog);

	return createdLog;
};

const normalizeHabitLog = (log: HabitLogDB): HabitLog => {
	const client: HabitLog = {
		logID: log.habit_id,
		habitID: log.habit_id,
		logTime: log.log_time,
		loggedValue: log.logged_value,
		notes: log.notes,
		createdDate: log.created_date,
	};

	return client;
};

export { normalizeHabitLog, logHabit };
