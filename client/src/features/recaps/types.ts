import { Activity } from "../shared/types";
import { CurrentStreak, LongestStreak } from "../streaks/types";
import { DateRange, RangeParams } from "../types";

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

export type WeeklyRecapActivities = {
	[key in Activity]: WeeklyRecapForActivity | WeeklyRecapForWalkActivity;
};

export interface WeeklyRecap {
	dateRange: RangeParams;
	streak: RecapStreaks;
	recap: {
		breakdown: WeeklyRecapBreakdown;
		completed: WeeklyRecapCompleted;
		topActivities: TopActivities;
	};
	activities: WeeklyRecapActivities;
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

// Progress bar - data viz shape
export interface RecapBar {
	when: string; // 'Last Week' or '2 weeks ago' etc
	what: string; // '7.2 mi' or '1h 38m' etc
	value: number;
	mins: number;
}
