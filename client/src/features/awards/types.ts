import { WorkoutStreakDetails } from "../streaks/types";
import { Activity } from "../shared/types";

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

export enum AwardCategory {
	NTH = "NTH",
	RECORD = "RECORD",
	PATTERN = "PATTERN",
}

export enum AwardMetric {
	WORKOUT = "WORKOUT",
	MINUTES = "MINUTES",
	MILES = "MILES",
	STEPS = "STEPS",
	REPS = "REPS",
	SETS = "SETS",
	VOLUME = "VOLUME",
	EFFORT = "EFFORT",
}
export interface WorkoutAward {
	awardID: number;
	awardName: string;
	awardDesc: string;
	awardCategory: AwardCategory;
	awardMetric: AwardMetric;
	awardThreshold: number;
	activityType: Activity | null;
	wasAchieved: boolean;
	achievedOn: string;
	awardValue: number;
	awardYear: number;
}

export type WorkoutAwards = {
	achieved: WorkoutAward[];
};

export type WorkoutStreakAwards = {
	details: WorkoutStreakDetails;
	achieved: StreakAward[];
};

export interface WorkoutAwardsAndStreaks {
	awards: WorkoutAwards;
	streaks: WorkoutStreakAwards;
}
