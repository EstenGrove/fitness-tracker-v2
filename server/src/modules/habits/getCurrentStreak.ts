import { format, subDays, subMonths, subWeeks } from "date-fns";
import { groupByFn } from "../../utils/misc.js";
import type {
	Habit,
	HabitDB,
	HabitFrequency,
	HabitIntent,
	HabitLog,
	HabitLogDB,
} from "./types.js";
import { habitsService } from "../../services/index.js";
import { normalizeHabit, normalizeHabitLog } from "./getUserHabits.js";

const getLogTotalForDate = (logs: HabitLog[]): number => {
	if (!logs || !logs.length) return 0;
	return logs.reduce((total, log) => (total += log.loggedValue), 0);
};

const getNextHabitInterval = (
	freq: HabitFrequency,
	baseDate: Date = new Date()
) => {
	switch (freq) {
		case "Daily": {
			return subDays(baseDate, 1);
		}
		case "Weekly": {
			return subWeeks(baseDate, 1);
		}

		case "Monthly": {
			return subMonths(baseDate, 1);
		}

		default:
			return baseDate;
	}
};

const hitHabitGoal = (
	total: number,
	habitInfo: { intent: HabitIntent; target: number }
) => {
	const { intent, target } = habitInfo;
	switch (intent) {
		case "BUILD": {
			return total >= target;
		}
		case "REDUCE": {
			return total <= target;
		}
		case "ELIMINATE": {
			return total === 0;
		}
		case "LAPSE": {
			return total <= target;
		}

		default:
			return false;
	}
};

const calculateHabitStreak = (habit: Habit, logs: HabitLog[]) => {
	const { habitTarget: target, frequency, intent } = habit;
	let streak = 0;
	let currentDay = new Date();
	const token = "MM/dd/yyyy";
	const groupedLogs = groupByFn<HabitLog>(logs, (log) =>
		format(log.logTime, token)
	);

	while (true) {
		const dateKey = format(currentDay, token);
		const dateLogs: HabitLog[] = groupedLogs[dateKey] || [];
		const total = getLogTotalForDate(dateLogs);
		const hitGoal = hitHabitGoal(total, { intent, target });

		if (hitGoal) {
			streak += 1;
			currentDay = getNextHabitInterval(frequency, currentDay);
		} else {
			break;
		}
	}

	return streak;
};

const getCurrentHabitStreak = async (userID: string, habitID: number) => {
	const [habitDB, logsDB] = await Promise.all([
		(await habitsService.getHabitByID(userID, habitID)) as HabitDB,
		(await habitsService.getHabitLogs(userID, habitID)) as HabitLogDB[],
	]);

	if (!habitDB || !logsDB) return 0;

	const habit: Habit = normalizeHabit(habitDB);
	const habitLogs: HabitLog[] = logsDB.map(normalizeHabitLog);
	const currentStreak: number = calculateHabitStreak(habit, habitLogs);
	return currentStreak;
};

export { hitHabitGoal, getCurrentHabitStreak, getNextHabitInterval };
