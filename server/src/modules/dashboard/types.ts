import type {
	HabitCard,
	HabitCardDB,
	RecentHabitLog,
	RecentHabitLogDB,
} from "../habits/types.ts";
import type { HistoryOfType, HistoryOfTypeDB } from "../history/types.ts";
import type { Activity, Effort } from "../types.ts";

export interface RecentWorkoutDB {
	user_id: string;
	history_id: number;
	workout_id: number;
	activity_type: Activity;
	workout_name: string;
	workout_date: string;
	start_time: string;
	end_time: string;
	duration: number;
	effort: Effort;
}
export interface RecentWorkout {
	userID: string;
	historyID: number;
	workoutID: number;
	activityType: Activity;
	workoutName: string;
	workoutDate: string;
	startTime: string;
	endTime: string;
	duration: number;
	effort: Effort;
}

export interface TotalCaloriesDB {
	start_date: string;
	end_date: string;
	total_calories: number;
}
export interface TotalCalories {
	startDate: string;
	endDate: string;
	totalCalories: number;
}
export interface TotalMilesDB {
	start_date: string;
	end_date: string;
	total_miles: number;
}
export interface TotalMiles {
	startDate: string;
	endDate: string;
	totalMiles: number;
}
export interface TotalStepsDB {
	start_date: string;
	end_date: string;
	total_steps: number;
}
export interface TotalSteps {
	startDate: string;
	endDate: string;
	totalSteps: number;
}
export interface TotalWorkoutsDB {
	start_date: string;
	end_date: string;
	total_workouts: number;
}
export interface TotalWorkouts {
	startDate: string;
	endDate: string;
	totalWorkouts: number;
}
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

export interface TodaysWorkoutProgressDB {
	todaysCalories: number;
	todaysScheduled: number; // number of workouts schedule
	todaysLogged: number; // number of recorded workouts so far today
	todaysLogs: HistoryOfTypeDB[];
}
export interface TodaysWorkoutProgress {
	todaysCalories: number;
	todaysScheduled: number; // number of workouts schedule
	todaysLogged: number; // number of recorded workouts so far today
	todaysLogs: HistoryOfType[];
}

export interface TodaysHabitProgressDB {
	todaysHabits: number; // number of habits for today
	// todaysSummaries: HabitSummary[];
	todaysSummaries: HabitCardDB[];
	todaysLogs: RecentHabitLogDB[];
}
export interface TodaysHabitProgress {
	todaysHabits: number; // number of habits for today
	// todaysSummaries: HabitSummary[];
	todaysSummaries: HabitCard[];
	todaysLogs: RecentHabitLog[];
}

export interface DashboardSummaryDB {
	// Totals (DB)
	totalMiles: TotalMilesDB;
	totalSteps: TotalStepsDB;
	totalWorkouts: TotalWorkoutsDB;
	totalCalories: TotalCaloriesDB;
	// Daily
	dailyMins: DailyMinsSummaryDB;
	dailySteps: DailyStepsSummaryDB;
	dailyCalories: DailyCaloriesSummaryDB;
	dailyWorkouts: DailyWorkoutsSummaryDB;
	// Recents
	recentWorkouts: RecentWorkoutDB[];
	// Workouts Progress
	workoutProgress: TodaysWorkoutProgressDB;
	// Habit Progress
	habitProgress: TodaysHabitProgressDB;
}

export interface DashboardSummary {
	// Totals (client)
	totalMiles: TotalMiles;
	totalSteps: TotalSteps;
	totalWorkouts: TotalWorkouts;
	totalCalories: TotalCalories;
	// Daily
	dailyMins: DailyMinsSummary;
	dailySteps: DailyStepsSummary;
	dailyCalories: DailyCaloriesSummary;
	dailyWorkouts: DailyWorkoutsSummary;
	// Recents
	recentWorkouts: RecentWorkout[];
	// Workouts Progress
	workoutProgress: TodaysWorkoutProgress;
	habitProgress: TodaysHabitProgress;
}
