import { habitsService } from "../../services/index.js";
import { getResponseError } from "../../utils/api.js";
import type { Habit, HabitDB, HabitLog, HabitLogDB } from "./types.js";

const getUserHabits = async (userID: string, targetDate: string) => {
	const rawHabits = (await habitsService.getHabits(
		userID,
		targetDate
	)) as HabitDB[];

	if (rawHabits instanceof Error) {
		return rawHabits;
	}

	const habits = rawHabits?.map((habit) => normalizeHabit(habit));

	return habits;
};

const normalizeHabit = (habit: HabitDB): Habit => {
	const record: Habit = {
		habitID: habit.habit_id,
		userID: habit.user_id,
		habitName: habit.habit_name,
		habitDesc: habit.habit_desc,
		intent: habit.intent,
		frequency: habit.frequency,
		habitTarget: habit.target_value,
		habitUnit: habit.target_unit,
		icon: habit.icon,
		iconColor: habit.icon_color,
		startDate: habit.start_date,
		endDate: habit.end_date,
		isActive: habit.isActive,
		createdDate: habit.createdDate,
	};

	return record;
};
const normalizeHabitLog = (habit: HabitLogDB): HabitLog => {
	const record: HabitLog = {
		habitID: habit.habit_id,
		logID: habit.log_id,
		logTime: habit.log_time,
		loggedValue: habit.logged_value,
		notes: habit.notes,
		createdDate: habit.created_date,
	};

	return record;
};

export { getUserHabits, normalizeHabit, normalizeHabitLog };
