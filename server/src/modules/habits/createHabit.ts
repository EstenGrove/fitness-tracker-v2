import { habitsService } from "../../services/index.ts";
import { normalizeHabit } from "./getUserHabits.ts";
import type { HabitDB, NewHabitValues } from "./types.ts";

const createHabit = async (userID: string, values: NewHabitValues) => {
	const record = (await habitsService.createHabit(userID, values)) as HabitDB;

	if (record instanceof Error) {
		return record;
	}

	const newHabit = normalizeHabit(record);

	return newHabit;
};

export { createHabit };
