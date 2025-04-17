export interface DailyMins {
	date: string;
	mins: number;
	weekDay: string;
}

export interface DailySteps {
	date: string;
	steps: number;
}
export interface DailyCalories {
	date: string;
	calories: number;
}

export interface DailyWorkouts {
	date: string;
	workouts: number;
}

export type DailyMinsSummary = DailyMins[];
export type DailyStepsSummary = DailySteps[];
export type DailyCaloriesSummary = DailyCalories[];
export type DailyWorkoutsSummary = DailyWorkouts[];

export interface DashboardSummary {
	dailyMins: DailyMinsSummary;
	dailySteps: DailyStepsSummary;
	dailyCalories: DailyCaloriesSummary;
	dailyWorkouts: DailyWorkoutsSummary;
}
