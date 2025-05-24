import { HabitCard, RecentHabitLog } from "../habits/types";
import { HistoryOfType } from "../history/types";
import { Activity, Effort } from "../shared/types";

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

export interface RecentWorkout {
	userID: string;
	workoutID: number;
	historyID: number;
	startTime: string;
	endTime: string;
	duration: number;
	workoutDate: string;
	activityType: Activity;
	workoutName: string;
	effort: Effort;
}
export interface TotalWorkouts {
	startDate: string;
	endDate: string;
	totalWorkouts: number;
}
export interface TotalMiles {
	startDate: string;
	endDate: string;
	totalMiles: number;
}
export interface TotalSteps {
	startDate: string;
	endDate: string;
	totalSteps: number;
}

export interface TodaysWorkoutProgress {
	todaysCalories: number;
	todaysScheduled: number; // number of workouts schedule
	todaysLogged: number; // number of recorded workouts so far today
	todaysLogs: HistoryOfType[];
}

export interface TodaysHabitProgress {
	todaysHabits: number; // number of habits for today
	// todaysSummaries: HabitSummary[];
	todaysSummaries: HabitCard[];
	todaysLogs: RecentHabitLog[];
}

export type DailyMinsSummary = DailyMins[];
export type DailyStepsSummary = DailySteps[];
export type DailyCaloriesSummary = DailyCalories[];
export type DailyWorkoutsSummary = DailyWorkouts[];

export interface DashboardSummary {
	// Daily Summaries
	dailyMins: DailyMinsSummary;
	dailySteps: DailyStepsSummary;
	dailyCalories: DailyCaloriesSummary;
	dailyWorkouts: DailyWorkoutsSummary;
	// Totals
	totalWorkouts: TotalWorkouts; // This week!
	totalMiles: TotalMiles;
	totalSteps: TotalSteps;
	// Recent Workout History (from the week)
	recentWorkouts: RecentWorkout[]; // This week!
	// Progress Data
	workoutProgress: TodaysWorkoutProgress; // Today
	habitProgress: TodaysHabitProgress; // Today
}
