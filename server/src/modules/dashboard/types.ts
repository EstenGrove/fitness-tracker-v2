export interface DailyMinsDB {
	date: string;
	mins: number;
	week_day: string;
}
export interface DailyStepsDB {
	date: string;
	steps: number;
	week_day: string;
}
export interface DailyCaloriesDB {
	date: string;
	calories: number;
	week_day: string;
}
export interface DailyWorkoutsDB {
	date: string;
	workouts: number;
	week_day: string;
}
export interface DailyMins {
	date: string;
	mins: number;
	weekDay: string;
}
export interface DailySteps {
	date: string;
	steps: number;
	weekDay: string;
}
export interface DailyCalories {
	date: string;
	calories: number;
	weekDay: string;
}
export interface DailyWorkouts {
	date: string;
	workouts: number;
	weekDay: string;
}
export type DailyMinsSummaryDB = DailyMinsDB[];
export type DailyStepsSummaryDB = DailyStepsDB[];
export type DailyCaloriesSummaryDB = DailyCaloriesDB[];
export type DailyWorkoutsSummaryDB = DailyWorkoutsDB[];

export type DailyMinsSummary = DailyMins[];
export type DailyStepsSummary = DailySteps[];
export type DailyCaloriesSummary = DailyCalories[];
export type DailyWorkoutsSummary = DailyWorkouts[];

export interface DashboardSummaryDB {
	dailyMins: DailyMinsSummaryDB;
	dailySteps: DailyStepsSummaryDB;
	dailyCalories: DailyCaloriesSummaryDB;
	dailyWorkouts: DailyWorkoutsSummaryDB;
}

export interface DashboardSummary {
	dailyMins: DailyMinsSummary;
	dailySteps: DailyStepsSummary;
	dailyCalories: DailyCaloriesSummary;
	dailyWorkouts: DailyWorkoutsSummary;
}
