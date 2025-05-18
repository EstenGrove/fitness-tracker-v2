import { habitsService } from "../../services/index.ts";
import { getResponseError } from "../../utils/api.ts";
import { normalizeHabitLog } from "./logHabit.ts";
import type { HabitLogDB, HabitLogValues } from "./types.ts";

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
