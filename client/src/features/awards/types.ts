import { WorkoutStreakDetails } from "../streaks/types";

export interface StreakAward {
	streakID: number;
	streakType: "BADGE" | "TROPHY" | "MEDAL";
	streakName: string;
	streakDesc: string;
	targetDays: number;
	maxStreak: number;
	wasAchieved: boolean;
	achievedOn: string;
	icon: string;
	iconColor: string;
}

export type WorkoutAwards = {
	nth: Array<object>;
	record: Array<object>;
	pattern: Array<object>;
};

export type WorkoutStreakAwards = {
	details: WorkoutStreakDetails;
	achieved: StreakAward[];
};

export interface WorkoutAwardsAndStreaks {
	awards: WorkoutAwards;
	streaks: WorkoutStreakAwards;
}
