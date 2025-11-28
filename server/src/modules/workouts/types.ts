import type { HistoryOfType, HistoryOfTypeDB } from "../history/types.js";
import type { Activity, Effort, RepeatType, WeekDayToken } from "../types.js";

export type WorkoutStatus = "COMPLETE" | "NOT-COMPLETE";

export interface Workout {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutName: string;
	duration: number;
	equipment: string | null;
	tagColor: string | null;
}
export interface WorkoutDB {
	user_id: string;
	workout_id: number;
	activity_type: Activity;
	workout_name: string;
	duration: number;
	equipment: string | null;
	tag_color: string | null;
}

export interface TodaysWorkoutDB {
	user_id: string;
	workout_id: number;
	activity_type: Activity;
	workout_name: string;
	duration: number;
	start_time: string;
	end_time: string;
	is_recurring: boolean;
	workout_status: WorkoutStatus;
	recorded_duration: number | null;
}
export interface TodaysWorkoutClient {
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
export interface WorkoutScheduleDB {
	user_id: string;
	schedule_id: number;
	activity_type: Activity;
	workout_id: number;
	start_date: string;
	end_date: string;
	start_time: string;
	end_time: string;
	interval: number;
	frequency: RepeatType;
	by_day: WeekDayToken[];
	by_month: number;
	by_month_day: number;
	is_active: boolean;
	created_date: string;
}

export interface WorkoutDetailsDB {
	workout: WorkoutOfTypeDB;
	schedule: WorkoutScheduleDB | null;
	history: HistoryOfTypeDB[];
}
export interface WorkoutDetails {
	workout: WorkoutOfType;
	schedule: WorkoutSchedule | null;
	history: HistoryOfType[];
}

export interface StrengthSet {
	id: number;
	weight: number;
	reps: number;
	sets: number;
}
export interface ExerciseSet {
	id: number;
	reps: number;
	exercise: string;
}

export type WorkoutSet = StrengthSet | ExerciseSet;

export interface LogWorkoutBody {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutDate: string;
	startTime: string;
	endTime: string;
	duration: number;
	workoutLength: number;
	effort?: Effort;
	steps?: number;
	miles?: number;
	pace?: number;
	exercise?: string;
	sets?: WorkoutSet[];
}

export interface SkipWorkoutBody {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutDate: string;
	reason?: string;
}

export interface SkippedWorkoutDB {
	user_id: string;
	workout_date: string;
	activity_type: Activity;
	was_skipped: boolean;
}
export interface SkippedWorkout {
	userID: string;
	workoutDate: string;
	activityType: Activity;
	wasSkipped: boolean;
}

export interface StrengthWorkoutDB extends WorkoutDB {
	reps: number;
	sets: number;
	weight: number;
}
export interface ExerciseWorkoutDB extends WorkoutDB {
	reps: number;
	sets: number;
	exercise: string;
}
export interface ExerciseWorkout extends Workout {
	reps: number;
	sets: number;
	exercise: string;
}

export interface WalkWorkoutDB extends WorkoutDB {
	steps: number;
	miles: number;
	pace: number;
}
export interface WalkWorkout extends Workout {
	steps: number;
	miles: number;
	pace: number;
}
export interface StrengthWorkout extends Workout {
	reps: number;
	sets: number;
	weight: number;
}

export type WorkoutByType<T> = Workout & T;
export type WorkoutByTypeDB<T> = WorkoutDB & T;

export type WorkoutOfType = StrengthWorkout | WalkWorkout | ExerciseWorkout;
export type WorkoutOfTypeDB =
	| StrengthWorkoutDB
	| WalkWorkoutDB
	| ExerciseWorkoutDB;

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

export interface DeleteWorkoutDateParams {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutDate: string;
}

export interface WasWorkoutDateDeleted {
	workoutID: number;
	activityType: Activity;
	targetDate: string;
	scheduleID: string | null;
	wasDeleted: boolean;
}

export interface ScheduledWorkoutDB extends TodaysWorkoutDB {
	workout_date: string;
}
export interface ScheduledWorkoutClient extends TodaysWorkoutClient {
	workoutDate: string;
}

export interface EditWorkoutParams {
	// INFO
	activityType: Activity;
	name: string;
	desc: string;
	duration: number;
	// GOALS
	sets: number;
	reps: number;
	weight: number;
	exercise: string;
	steps: number;
	miles: number;
	pace: number;
	// SCHEDULE
	isRecurring: boolean;
	frequency: RepeatType | string;
	interval: 1;
	byDay: string[];
	byMonth: string | number;
	byMonthDay: string | number;
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
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
export interface RecurringScheduleAndDates {
	schedule: WorkoutSchedule;
	dates: WorkoutDate[];
}

export interface WorkoutDetailsInfo {
	workout: WorkoutOfType;
	schedule: WorkoutSchedule;
	history: HistoryOfType[];
}
