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

export interface ScheduledWorkout extends TodaysWorkout {
	workoutDate: string;
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
	steps: number;
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

export interface CreateWorkoutValues {
	activityType: Activity | string;
	date: Date | string;
	name: string;
	desc: string;
	duration: number;
	effort: number;
	isRecurring: boolean;
	interval: number;
	frequency: RepeatType;
	byDay: string[];
	byMonth: number | string;
	byMonthDay: number | string;
	startDate: Date | string;
	endDate: Date | string;
	startTime: string;
	endTime: string;
	steps: number | null;
	miles: number | null;
	pace: number | null;
	equipment: string | null;
	tagColor: string | null;
	exercise: string | null;
}

export interface CreateWorkoutParams {
	workout: {
		userID: string;
		workoutName: string;
		workoutDesc: string;
		activityType: string;
		date: string;
		duration: number;
		effort: string;
		reps: number | null;
		sets: number | null;
		weight: number | null;
		steps: number | null;
		miles: number | null;
		pace: number | null;
		equipment: string;
		tagColor: string;
		isRecurring: boolean;
	};
	schedule: {
		userID: string;
		activityType: string;
		startDate: string;
		endDate: string;
		startTime: string;
		endTime: string;
		interval: number;
		frequency: string;
		byDay: string[];
		byMonth: number | string | null;
		byMonthDay: number | string | null;
	};
}

export interface CreatedWorkoutData {
	workout: WorkoutByType;
	schedule: WorkoutSchedule;
}

export interface WorkoutDateDB {
	id: number;
	dates: string[];
	schedule_id: number;
	last_updated: string;
}
export interface WorkoutDate {
	id: number;
	dates: string[];
	scheduleID: number;
	lastUpdated: string;
}
// This comes from the 'v_active_workouts' VIEW & gets converted to this format
export interface ActiveWorkout {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutName: string;
	workoutDesc: string;
	duration: number;
	isRecurring: boolean;
	equipment: string;
	tagColor: string | null;
	isActive: boolean;
	createdDate: string;
}
export interface RecurringWorkoutData {
	workout: ActiveWorkout;
	schedule: WorkoutSchedule;
	dates: WorkoutDate[];
}
