import { normalizeHabitCard } from "../habits/getHabitCards.ts";
import { normalizeRecentHabitLogs } from "../habits/getRecentHabitLogs.ts";
import type { HabitCard } from "../habits/types.ts";
import {
	normalizeHistoryByType,
	normalizeHistoryEntryByType,
} from "../history/allHistory.ts";
import type {
	DailyCalories,
	DailyCaloriesDB,
	DailyMins,
	DailyMinsDB,
	DailySteps,
	DailyStepsDB,
	DailyWorkouts,
	DailyWorkoutsDB,
	DashboardSummary,
	DashboardSummaryDB,
	RecentWorkout,
	RecentWorkoutDB,
	TodaysHabitProgress,
	TodaysHabitProgressDB,
	TodaysWorkoutProgress,
	TodaysWorkoutProgressDB,
	TotalCalories,
	TotalCaloriesDB,
	TotalMiles,
	TotalMilesDB,
	TotalSteps,
	TotalStepsDB,
	TotalWorkouts,
	TotalWorkoutsDB,
} from "./types.ts";

const normalizeDailyMins = (dailyMins: DailyMinsDB[]): DailyMins[] => {
	if (!dailyMins || !dailyMins.length) return [];

	const newMins: DailyMins[] = dailyMins.map((item) => ({
		date: item.date,
		mins: item.mins,
		weekDay: item.week_day,
	}));
	return newMins;
};
const normalizeDailySteps = (dailySteps: DailyStepsDB[]): DailySteps[] => {
	if (!dailySteps || !dailySteps.length) return [];

	const newMins: DailySteps[] = dailySteps.map((item) => ({
		date: item.date,
		steps: item.steps,
		weekDay: item.week_day,
	}));
	return newMins;
};
const normalizeDailyCalories = (
	dailyCals: DailyCaloriesDB[]
): DailyCalories[] => {
	if (!dailyCals || !dailyCals.length) return [];

	const newCals: DailyCalories[] = dailyCals.map((item) => ({
		date: item.date,
		calories: item.calories,
		weekDay: item.week_day,
	}));
	return newCals;
};
const normalizeDailyWorkouts = (
	dailyWorkouts: DailyWorkoutsDB[]
): DailyWorkouts[] => {
	if (!dailyWorkouts || !dailyWorkouts.length) return [];

	const newWorkouts: DailyWorkouts[] = dailyWorkouts.map((item) => ({
		date: item.date,
		workouts: item.workouts,
		weekDay: item.week_day,
	}));
	return newWorkouts;
};
// Totals
const normalizeTotalMiles = (miles: TotalMilesDB): TotalMiles => {
	const newMiles: TotalMiles = {
		startDate: miles.start_date,
		endDate: miles.end_date,
		totalMiles: miles.total_miles,
	};
	return newMiles;
};
const normalizeTotalSteps = (steps: TotalStepsDB): TotalSteps => {
	const newSteps: TotalSteps = {
		startDate: steps.start_date,
		endDate: steps.end_date,
		totalSteps: steps.total_steps,
	};
	return newSteps;
};
const normalizeTotalWorkouts = (workouts: TotalWorkoutsDB): TotalWorkouts => {
	const newSteps: TotalWorkouts = {
		startDate: workouts.start_date,
		endDate: workouts.end_date,
		totalWorkouts: workouts.total_workouts,
	};
	return newSteps;
};
const normalizeTotalCalories = (miles: TotalCaloriesDB): TotalCalories => {
	const newMiles: TotalCalories = {
		startDate: miles.start_date,
		endDate: miles.end_date,
		totalCalories: miles.total_calories,
	};
	return newMiles;
};

const normalizeWorkoutProgress = (
	progress: TodaysWorkoutProgressDB
): TodaysWorkoutProgress => {
	const { todaysLogs } = progress;
	const logs = todaysLogs.map((entry) =>
		normalizeHistoryEntryByType(entry.activity_type, entry)
	);

	return {
		...progress,
		todaysLogs: logs,
	};
};

// Recents
const normalizeRecentWorkouts = (
	workouts: RecentWorkoutDB[]
): RecentWorkout[] => {
	if (!workouts || !workouts.length) return [];
	const newWorkouts: RecentWorkout[] = workouts.map((workout) => ({
		userID: workout.user_id,
		historyID: workout.history_id,
		workoutID: workout.workout_id,
		workoutDate: workout.workout_date,
		workoutName: workout.workout_name,
		duration: workout.duration,
		startTime: workout.start_time,
		endTime: workout.end_time,
		effort: workout.effort,
		activityType: workout.activity_type,
	}));
	return newWorkouts;
};

const normalizeHabitProgress = (
	progress: TodaysHabitProgressDB
): TodaysHabitProgress => {
	const { todaysHabits, todaysSummaries, todaysLogs } = progress;

	const recentLogs = normalizeRecentHabitLogs(todaysLogs);
	const summaries: HabitCard[] = todaysSummaries.map(normalizeHabitCard);

	return {
		todaysHabits: todaysHabits,
		todaysSummaries: summaries,
		todaysLogs: recentLogs,
	};
};

const normalizeDashboardSummary = (
	summary: DashboardSummaryDB
): DashboardSummary => {
	// Daily
	const dailyMins = normalizeDailyMins(summary.dailyMins);
	const dailySteps = normalizeDailySteps(summary.dailySteps);
	const dailyCalories = normalizeDailyCalories(summary.dailyCalories);
	// Totals
	const totalMiles = normalizeTotalMiles(summary.totalMiles);
	const totalSteps = normalizeTotalSteps(summary.totalSteps);
	const totalWorkouts = normalizeTotalWorkouts(summary.totalWorkouts);
	const totalCalories = normalizeTotalCalories(summary.totalCalories);
	// Recents
	const recentWorkouts = normalizeRecentWorkouts(summary.recentWorkouts);
	// Workout Progress
	const workoutProgress = normalizeWorkoutProgress(summary.workoutProgress);
	// Habit Progress
	const habitProgress = normalizeHabitProgress(summary.habitProgress);

	const dailyWorkouts = summary.dailyWorkouts.map((item) => ({
		date: item.date,
		workouts: item.workouts,
		weekDay: item.week_day,
	}));

	return {
		// Daily
		dailyMins,
		dailySteps,
		dailyCalories,
		dailyWorkouts,
		// Totals
		totalMiles,
		totalSteps,
		totalWorkouts,
		totalCalories,
		// Recents
		recentWorkouts,
		// Workouts Progress
		workoutProgress,
		// Habit Progress
		habitProgress,
	};
};

export {
	normalizeDashboardSummary,
	// Individual //
	// Totals
	normalizeTotalMiles,
	normalizeTotalSteps,
	normalizeTotalWorkouts,
	normalizeTotalCalories,
	// Daily
	normalizeDailyWorkouts,
	normalizeDailyCalories,
	normalizeDailyMins,
	normalizeDailySteps,
	// Recents
	normalizeRecentWorkouts,
	// Workout Progrdss
	normalizeWorkoutProgress,
	// Habit Progress
	normalizeHabitProgress,
};
