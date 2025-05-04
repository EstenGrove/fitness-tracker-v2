import type { HistoryOfType, HistoryOfTypeDB } from "../history/types.ts";
import type { Activity, Effort, RepeatType, WeekDayToken } from "../types.ts";

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
	workout: TodaysWorkoutDB;
	schedule: WorkoutScheduleDB | null;
	history: HistoryOfTypeDB[];
}
export interface WorkoutDetails {
	workout: TodaysWorkoutClient;
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
