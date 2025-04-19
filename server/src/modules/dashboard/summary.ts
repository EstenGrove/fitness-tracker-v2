import type {
	DailyCalories,
	DailyCaloriesDB,
	DailyMins,
	DailyMinsDB,
	DailySteps,
	DailyStepsDB,
	DashboardSummary,
	DashboardSummaryDB,
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

const normalizeDashboardSummary = (
	summary: DashboardSummaryDB
): DashboardSummary => {
	const dailyMins = normalizeDailyMins(summary.dailyMins);
	const dailySteps = normalizeDailySteps(summary.dailySteps);
	const dailyCalories = normalizeDailyCalories(summary.dailyCalories);

	const dailyWorkouts = summary.dailyWorkouts.map((item) => ({
		date: item.date,
		workouts: item.workouts,
		weekDay: item.week_day,
	}));

	return {
		dailyMins,
		dailySteps,
		dailyCalories,
		dailyWorkouts,
	};
};

export {
	normalizeDashboardSummary,
	normalizeDailyCalories,
	normalizeDailyMins,
	normalizeDailySteps,
};
