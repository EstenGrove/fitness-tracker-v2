import { WorkoutStreakDetails } from "../streaks/types";
import { Activity } from "../shared/types";
import {
	AchievementAwardColor,
	AchievementAwardShape,
	AchievementVariant,
} from "../../components/achievements/AchievementAward";

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
	OTHER = "OTHER",
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

export interface AchievementDisplay {
	title: string;
	label?: string;
	shape: AchievementAwardShape;
	color: AchievementAwardColor;
	variant?: AchievementVariant;
	category: AwardCategory;
	achievedOn: string;
	wasAchieved: boolean;
}

// Returns the color & optional variant based off the tier the award falls in
export type AchievementDisplayTier = {
	color: AchievementAwardColor;
	variant?: AchievementVariant;
};
