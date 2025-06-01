import { habitsService } from "../../services/index.js";
import { getResponseError } from "../../utils/api.js";
import { normalizeHabitLog } from "./logHabit.js";
import type { HabitLogDB, HabitLogValues } from "./types.js";

const logHabitsBatched = async (newLogs: HabitLogValues[]) => {
	if (!newLogs) {
		throw new Error("No logs provided!");
	}

	const savedLogs = (await habitsService.logHabitsBatched(
		newLogs
	)) as HabitLogDB[];

	if (savedLogs instanceof Error) {
		return savedLogs;
	}

	const habitLogs = savedLogs.map(normalizeHabitLog);

	return habitLogs;
};

export { logHabitsBatched };
