import { Activity } from "../shared/types";

export interface PostWorkoutParams {
	userID: string;
	historyID: number;
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

export interface PostWorkoutStrength extends PostWorkoutStats {
	activityStats: PostStrengthStats;
}
export interface PostWorkoutWalk extends PostWorkoutStats {
	activityStats: PostWalkStats;
}
export interface PostWorkoutCardio extends PostWorkoutStats {
	activityStats: PostCardioStats;
}
export interface PostWorkoutStretch extends PostWorkoutStats {
	activityStats: PostStretchStats;
}
export interface PostWorkoutTimed extends PostWorkoutStats {
	activityStats: PostTimedStats;
}
export interface PostWorkoutOther extends PostWorkoutStats {
	activityStats: PostOtherStats;
}
