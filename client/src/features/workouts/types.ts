import { WeekDayToken } from "../../utils/utils_dates";
import { HistoryOfType } from "../history/types";
import { Activity, RepeatType } from "../shared/types";

export type WorkoutStatus =
	| "COMPLETE"
	| "IN-PROGRESS"
	| "NOT-COMPLETE"
	| "SKIPPED";

export enum EWorkoutStatus {
	COMPLETE = "COMPLETE",
	"IN-PROGRESS" = "IN-PROGRESS",
	"NOT-COMPLETE" = "NOT-COMPLETE",
	SKIPPED = "SKIPPED",
}

export interface Workout {
	userID: string;
	workoutID: number;
	workoutName: string;
	activityType: Activity;
	workoutDesc: string;
	duration: number;
	tagColor: string | null;
	startTime: string;
	endTime: string;
	isRecurring: boolean;
	status: WorkoutStatus;
}

export interface TodaysWorkout {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutName: string;
	duration: number;
	startTime: string;
	endTime: string;
	isRecurring: boolean;
	workoutStatus: WorkoutStatus;
	recordedDuration: number | null;
	tagColor?: string | null;
}

export interface WorkoutSchedule {
	userID: string;
	scheduleID: number;
	activityType: Activity;
	workoutID: number;
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	interval: number;
	frequency: RepeatType;
	byDay: WeekDayToken[];
	byMonth: number;
	byMonthDay: number;
	isActive: boolean;
	createdDate: string;
}

export interface StrengthSet {
	id: number;
	sets: number;
	reps: number;
	weight: number;
}

export interface ExerciseSet {
	id: number;
	sets: number;
	reps: number;
	exercise: string;
}

export interface StrengthWorkout extends Workout {
	reps: number;
	sets: number;
	weight: number;
	equipment: string | null;
}
export interface StretchWorkout extends Workout {
	sets: number;
	reps: number;
	exercise: string | null;
	equipment: string | null;
}
export interface WalkWorkout extends Workout {
	steos: number;
	miles: string;
	pace: string;
}
export interface CardioWorkout extends Workout {
	sets: number;
	reps: number;
	exercise: string | null;
	equipment: string | null;
}
export interface TimedWorkout extends Workout {
	sets: number;
	reps: number;
	exercise: string | null;
	equipment: string | null;
}
export interface OtherWorkout extends Workout {
	sets: number;
	reps: number;
	exercise: string | null;
	equipment: string | null;
}

export type WorkoutByType =
	| StrengthWorkout
	| StretchWorkout
	| WalkWorkout
	| CardioWorkout
	| TimedWorkout
	| OtherWorkout;

export interface WorkoutDetails {
	workout: WorkoutByType;
	schedule: WorkoutSchedule;
	history: HistoryOfType[];
}
