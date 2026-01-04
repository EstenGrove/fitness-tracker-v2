import { Activity } from "../shared/types";
import { CurrentStreak, LongestStreak } from "../streaks/types";
import { DateRange } from "../types";

export interface WeeklyRecapBreakdown {
	totalMins: number;
	totalWorkouts: number;
}

// How many scheduled workouts were completed for the range
export interface WeeklyRecapCompleted {
	totalCount: number;
	completedCount: number;
}

export interface TopActivity {
	totalMins: number;
	activityType: Activity;
	totalWorkouts: number;
}

export type TopActivities = TopActivity[];

export interface WeeklyRecapForActivity {
	totalMins: number;
	longestMins: number;
	activityType: Activity;
	totalWorkouts: number;
}

export interface WeeklyRecapForWalkActivity extends WeeklyRecapForActivity {
	totalMiles: number;
	totalSteps: number;
	longestMiles: number;
	longestSteps: number;
}

export interface RecapStreaks {
	current: CurrentStreak;
	longest: LongestStreak;
}

export interface WeeklyRecap {
	streak: RecapStreaks;
	recap: {
		breakdown: WeeklyRecapBreakdown;
		completed: WeeklyRecapCompleted;
		topActivities: TopActivities;
	};
	activities: {
		[key in Activity]: WeeklyRecapForActivity | WeeklyRecapForWalkActivity;
	};
}

export interface RecapForRange extends WeeklyRecap {
	range: DateRange;
}

export type RecapCardData<K extends keyof WeeklyRecap> = Pick<WeeklyRecap, K>;

export type WeeklyRecaps = {
	currentWeek: WeeklyRecap;
	oneWeekAgo: WeeklyRecap;
	twoWeeksAgo: WeeklyRecap;
};
