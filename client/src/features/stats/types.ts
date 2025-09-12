import { TotalMinsBy } from "../../utils/utils_stats";
import { Activity, Effort } from "../shared/types";
import { ExerciseSet, StrengthSet } from "../workouts/types";

export interface WorkoutStatsParams {
	userID: string;
	historyID: number;
	activityType: Activity;
}

export interface PostWorkoutParams {
	userID: string;
	workoutID: number;
	activityType: Activity;
}

export interface NthStats {
	nthWorkout: string;
	nthLongestWorkout: string;
	nthHighestEffort: string;
	nthActivityWorkout: string;
}

export interface ActiveDaysStat {
	startDate: string;
	endDate: string;
	daysActive: boolean;
}

/**
 * Strength-Related Stats
 */

export interface PostStrengthStats {
	// Weight Vol. (reps * weight)
	totalWorkoutsPerWeek: number;
	totalMins: number;
	totalVolume: number;
	totalReps: number;
	// Reps (reps * sets)
	avgWorkoutsPerWeek: number;
	avgMins: number;
	avgVolume: number;
	avgReps: number;
}

/**
 * Walk-Related Stats
 */
export interface PostWalkStats {
	// Totals for workout
	totalWorkoutsPerWeek: number;
	totalMins: number;
	totalSteps: number; // for workout
	totalMiles: number; // for workout
	// Averages per workout
	avgWorkoutsPerWeek: number;
	avgMins: number; // per workout
	avgSteps: number; // per workout
	avgMiles: number; // per workout
}

/**
 * Cardio-Related Stats
 */
export interface PostCardioStats {
	// Totals
	totalWorkoutsPerWeek: number;
	totalSets: number;
	totalReps: number;
	totalMins: number;
	// Averages
	avgWorkoutsPerWeek: number;
	avgSets: number;
	avgReps: number;
	avgMins: number;
}
/**
 * Stretch-Related Stats
 */
export interface PostStretchStats {
	// Totals
	totalWorkoutsPerWeek: number;
	totalSets: number;
	totalReps: number;
	totalMins: number;
	// Averages
	avgWorkoutsPerWeek: number;
	avgSets: number;
	avgReps: number;
	avgMins: number;
}
/**
 * Timed-Related Stats
 */
export interface PostTimedStats {
	// Totals
	totalWorkoutsPerWeek: number;
	totalSets: number;
	totalReps: number;
	totalMins: number;
	// Averages
	avgWorkoutsPerWeek: number;
	avgSets: number;
	avgReps: number;
	avgMins: number;
}
/**
 * Other-Related Stats
 */

export interface PostOtherStats {
	// Totals
	totalWorkoutsPerWeek: number;
	totalSets: number;
	totalReps: number;
	totalMins: number;
	// Averages
	avgWorkoutsPerWeek: number;
	avgSets: number;
	avgReps: number;
	avgMins: number;
}

// POST WORKOUT SESSION STATS (BY ACTIVITY) //

export interface PostWorkoutStats {
	nthStats: NthStats;
	activeDays: ActiveDaysStat;
}

export interface PostWorkoutStrengthActivity extends PostWorkoutStats {
	activityStats: PostStrengthStats;
}
export interface PostWorkoutWalkActivity extends PostWorkoutStats {
	activityStats: PostWalkStats;
}
export interface PostWorkoutCardioActivity extends PostWorkoutStats {
	activityStats: PostCardioStats;
}
export interface PostWorkoutStretchActivity extends PostWorkoutStats {
	activityStats: PostStretchStats;
}
export interface PostWorkoutTimedActivity extends PostWorkoutStats {
	activityStats: PostTimedStats;
}
export interface PostWorkoutOtherActivity extends PostWorkoutStats {
	activityStats: PostOtherStats;
}

export type WorkoutStats = (
	| PostStrengthStats
	| PostStretchStats
	| PostWalkStats
	| PostCardioStats
	| PostTimedStats
	| PostOtherStats
) &
	PostWorkoutStats;

export interface PostWorkoutHistory {
	userID: string;
	workoutID: number;
	historyID: number;
	activityType: Activity;
	workoutName: string;
	workoutDate: string;
	startTime: string;
	endTime: string;
	duration: number;
	effort: Effort;
	calories: number;
}
export interface PostWorkoutWorkout {
	userID: string;
	workoutID: number;
	historyID: number;
	activityType: Activity;
	workoutName: string;
	workoutDate: string;
	startTime: string;
	endTime: string;
	duration: number;
	effort: Effort;
	calories: number;
}

export interface PostWorkout {
	history: PostWorkoutHistory;
	workout: PostWorkoutWorkout;
	nthStats: {
		nthWorkout: string;
	};
}

export interface PostWorkoutCardioHistory extends PostWorkoutHistory {
	sets: ExerciseSet[];
	exercise?: string;
}
export interface PostWorkoutTimedHistory extends PostWorkoutHistory {
	sets: ExerciseSet[];
	exercise?: string;
}
export interface PostWorkoutStretchHistory extends PostWorkoutHistory {
	sets: ExerciseSet[];
	exercise?: string;
}
export interface PostWorkoutOtherHistory extends PostWorkoutHistory {
	sets: ExerciseSet[];
	exercise?: string;
}
export interface PostWorkoutWalkHistory extends PostWorkoutHistory {
	steps: number;
	miles: number;
	pace: number;
}
export interface PostWorkoutStrengthHistory extends PostWorkoutHistory {
	sets: StrengthSet[];
}

export type PostWorkoutOfType<T extends PostWorkoutHistory> = {
	history: T;
	workout: PostWorkoutWorkout;
	nthStats: NthStats;
};

export type PostWorkoutStrength = PostWorkoutOfType<PostWorkoutStrengthHistory>;
export type PostWorkoutStretch = PostWorkoutOfType<PostWorkoutStretchHistory>;
export type PostWorkoutCardio = PostWorkoutOfType<PostWorkoutCardioHistory>;
export type PostWorkoutWalk = PostWorkoutOfType<PostWorkoutWalkHistory>;
export type PostWorkoutTimed = PostWorkoutOfType<PostWorkoutTimedHistory>;
export type PostWorkoutOther = PostWorkoutOfType<PostWorkoutOtherHistory>;

export type PostWorkoutDetails =
	| PostWorkoutStrength
	| PostWorkoutStretch
	| PostWorkoutCardio
	| PostWorkoutWalk
	| PostWorkoutTimed
	| PostWorkoutOther;

export type PostWorkoutHistoryWithSets = PostWorkoutHistory & {
	sets: StrengthSet[] | ExerciseSet[];
};

export type TimeKey = "day" | "week" | "month" | "year";

export type MinsSummaryItem<T extends TimeKey> = {
	startDate: string;
	endDate: string;
	mins: number;
} & {
	[K in T]: string;
};

export interface MinsSummaryData<T extends TimeKey> {
	summary: MinsSummaryItem<T>[];
}

export interface StatsSummaryItem {
	label: string; // Might be a date, or a day of the month or a month name etc
	value: number;
	date: string;
	[key: string]: number | string | boolean;
}

export interface MonthlyMinsStats {
	month: string;
	monthStart: string;
	monthEnd: string;
	totalMins: number;
}

export interface ByYearParams {
	userID: string;
	targetYear: number;
}

export interface MinsByParams extends TotalMinsBy {
	userID: string;
}
