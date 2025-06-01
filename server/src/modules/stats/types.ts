import type { Activity, Effort } from "../types.js";
import type { StrengthSet } from "../history/types.js";
import type { ExerciseSet } from "../workouts/types.js";

export interface PostWorkoutParams {
	userID: string;
	workoutID: number;
	historyID: number;
	activityType: Activity;
}

export interface NthStats {
	nthWorkout: string;
	nthHighestEffort: string;
	nthLongestWorkout: string;
	nthActivityWorkout: string;
}

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
	nthStats: {
		nthWorkout: string;
	};
};

export type PostWorkoutStrength = PostWorkoutOfType<PostWorkoutStrengthHistory>;
export type PostWorkoutStretch = PostWorkoutOfType<PostWorkoutStretchHistory>;
export type PostWorkoutCardio = PostWorkoutOfType<PostWorkoutCardioHistory>;
export type PostWorkoutWalk = PostWorkoutOfType<PostWorkoutWalkHistory>;
export type PostWorkoutTimed = PostWorkoutOfType<PostWorkoutTimedHistory>;
export type PostWorkoutOther = PostWorkoutOfType<PostWorkoutOtherHistory>;
