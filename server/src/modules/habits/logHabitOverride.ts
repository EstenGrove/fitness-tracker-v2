import { habitsService } from "../../services/index.js";
import { normalizeHabitLog } from "./getUserHabits.js";
import type { HabitLogDB, HabitLogValues } from "./types.js";

/**
 * This function allows setting a FINAL total for a given habit & date
 */

const logHabitOverride = async (newLog: HabitLogValues) => {
	const results = (await habitsService.logHabitOverride(
		newLog
	)) as HabitLogDB[];

	if (results instanceof Error) {
		return results;
	}
	const newLogs = results?.map(normalizeHabitLog);

	return newLogs;
};

export { logHabitOverride };
