import type { NewHabitGoalParams } from "../../services/HabitsService.js";
import { habitsService } from "../../services/index.js";
import { normalizeHabit, normalizeHabitGoal } from "./getUserHabits.js";
import type {
	Habit,
	HabitDB,
	HabitGoalHistory,
	HabitGoalHistoryDB,
} from "./types.js";

export interface NewHabitGoalDataDB {
	updatedHabit: HabitDB;
	endedGoal: HabitGoalHistoryDB;
}
export interface NewHabitGoalData {
	updatedHabit: Habit;
	endedGoal: HabitGoalHistory;
}

const changeHabitGoal = async (data: NewHabitGoalParams) => {
	const response = (await habitsService.changeHabitGoal(
		data
	)) as NewHabitGoalDataDB;

	if (response instanceof Error) {
		return response;
	}

	const habit = normalizeHabit(response.updatedHabit);
	const goal = normalizeHabitGoal(response.endedGoal);
	9;

	return {
		updatedHabit: habit,
		endedGoal: goal,
	};
};

export { changeHabitGoal };
