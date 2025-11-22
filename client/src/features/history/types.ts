import { WorkoutSet } from "../../utils/utils_workouts";
import { Activity, Effort } from "../shared/types";
import { ExerciseSet, StrengthSet, WorkoutByType } from "../workouts/types";

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
	sets: ExerciseSet[];
	reps: number;
	exercise: string | null;
}
export interface CardioHistory extends WorkoutHistory {
	reps: number;
	exercise: string;
	sets: WorkoutSet[];
}
export interface TimedHistory extends WorkoutHistory {
	reps: number;
	sets: ExerciseSet[];
	exercise: string;
}
export interface OtherHistory extends WorkoutHistory {
	reps: number;
	sets: ExerciseSet[];
	exercise: string;
}

export interface AllHistory {
	all: WorkoutHistory[];
	strength: StrengthHistory[];
	walk: WalkHistory[];
	stretch: StretchHistory[];
	cardio: CardioHistory[];
	timed: TimedHistory[];
	other: OtherHistory[];
}

export type HistoryOfType =
	| StrengthHistory
	| WalkHistory
	| CardioHistory
	| StretchHistory
	| TimedHistory
	| OtherHistory;

export type HistoryForActivity<T> = WorkoutHistory & T;

export interface HistoryDetails {
	activityType: Activity;
	workout: WorkoutByType;
	history: HistoryOfType;
}
