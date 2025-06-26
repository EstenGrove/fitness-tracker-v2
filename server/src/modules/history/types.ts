import type { Activity, Effort } from "../types.js";
import type { Workout, WorkoutByTypeDB, WorkoutDB } from "../workouts/types.js";

export interface StrengthSet {
	id: number;
	sets: number;
	reps: number;
	weight: number;
}
export interface HistorySet {
	id: number;
	reps: number;
	exercise?: string | null;
}

export interface WorkoutHistoryDB {
	user_id: string;
	history_id: number;
	workout_id: number;
	activity_type: Activity;
	workout_name: string;
	workout_date: string;
	start_time: string;
	end_time: string;
	duration: number;
	target_duration: number;
	effort: Effort;
	calories: number;
	created_date: string;
}

export interface WalkHistoryDB extends WorkoutHistoryDB {
	steps: number;
	miles: number;
	pace: number;
}
export interface StrengthHistoryDB extends WorkoutHistoryDB {
	sets: StrengthSet[];
}
export interface StretchHistoryDB extends WorkoutHistoryDB {
	reps: number;
}
export interface CardioHistoryDB extends WorkoutHistoryDB {
	sets: HistorySet[];
	exercise: string;
}
export interface TimedHistoryDB extends WorkoutHistoryDB {
	sets: HistorySet[];
	exercise: string;
}
export interface OtherHistoryDB extends WorkoutHistoryDB {
	sets: HistorySet[];
	exercise: string;
}

// CLIENT

export interface WorkoutHistory {
	userID: string;
	historyID: number;
	workoutID: number;
	activityType: Activity;
	workoutName: string;
	workoutDate: string;
	startTime: string;
	endTime: string;
	duration: number;
	targetDuration: number;
	effort: Effort;
	calories: number;
	createdDate: string;
}
export interface WalkHistory extends WorkoutHistory {
	steps: number;
	miles: number;
	pace: number;
}
export interface StrengthHistory extends WorkoutHistory {
	sets: StrengthSet[];
}
export interface StretchHistory extends WorkoutHistory {
	reps: number;
}
export interface CardioHistory extends WorkoutHistory {
	sets: HistorySet[];
	exercise: string;
}
export interface TimedHistory extends WorkoutHistory {
	sets: HistorySet[];
	exercise: string;
}
export interface OtherHistory extends WorkoutHistory {
	sets: HistorySet[];
	exercise: string;
}

export type HistoryOfTypeDB =
	| StrengthHistoryDB
	| WalkHistoryDB
	| CardioHistoryDB
	| StretchHistoryDB
	| TimedHistoryDB
	| OtherHistoryDB;
export type HistoryOfType =
	| StrengthHistory
	| WalkHistory
	| CardioHistory
	| StretchHistory
	| TimedHistory
	| OtherHistory;

export interface AllHistoryDB {
	all: HistoryOfTypeDB[];
	strength: StrengthHistoryDB[];
	stretch: StretchHistoryDB[];
	walk: WalkHistoryDB[];
	cardio: CardioHistoryDB[];
	timed: TimedHistoryDB[];
	other: OtherHistoryDB[];
}
export interface AllHistory {
	all: HistoryOfType[];
	strength: StrengthHistory[];
	stretch: StretchHistory[];
	walk: WalkHistory[];
	cardio: CardioHistory[];
	timed: TimedHistory[];
	other: OtherHistory[];
}

export interface HistoryDetailsDB {
	workout: WorkoutDB;
	history: HistoryOfTypeDB;
	activityType: Activity;
	calories: number;
}
export interface HistoryDetails {
	workout: Workout;
	history: HistoryOfType;
	activityType: Activity;
}
