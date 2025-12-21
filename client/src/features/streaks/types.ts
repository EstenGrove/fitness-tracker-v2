import { AsyncResponse } from "../types";

export interface CurrentStreak {
	streakStart: string;
	streakEnd: string;
	currentStreak: number;
}
export interface LongestStreak {
	streakStart: string;
	streakEnd: string;
	longestStreak: number;
}

export interface ActiveWorkoutDays {
	activeDays: number;
	totalDays: number;
}

export interface HabitGoalDays {
	goalDays: number;
	totalDays: number;
}

export interface WorkoutStreakDetails {
	activeDays: ActiveWorkoutDays;
	currentStreak: CurrentStreak;
	longestStreak: LongestStreak;
}
export interface HabitStreakDetails {
	goalDays: HabitGoalDays;
	currentStreak: CurrentStreak;
	longestStreak: LongestStreak;
}

export type WorkoutStreakDetailsResp = AsyncResponse<WorkoutStreakDetails>;
export type HabitStreakDetailsResp = AsyncResponse<HabitStreakDetails>;
