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

export interface WorkoutAwardsAndStreaks {
	awards: {
		nth: Array<object>;
		record: Array<object>;
		pattern: Array<object>;
	};
	streaks: {
		// Current & Longest
		details: WorkoutStreakDetails;
		// All achieved streaks (eg. 3, 7, 14, 30 days etc.)
		achieved: StreakAward[];
	};
}
