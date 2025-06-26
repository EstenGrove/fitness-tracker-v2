import { habitsService } from "../../services/index.js";
import { normalizeHabit } from "./getUserHabits.js";
import type { HabitDB, NewHabitValues } from "./types.js";

const createHabit = async (userID: string, values: NewHabitValues) => {
	const record = (await habitsService.createHabit(userID, values)) as HabitDB;

	if (record instanceof Error) {
		return record;
	}

	const newHabit = normalizeHabit(record);

	return newHabit;
};

export { createHabit };
