import { WeekDayToken } from "../../utils/utils_dates";
import { Activity, RepeatType } from "../shared/types";

export type WorkoutStatus = "COMPLETE" | "IN-PROGRESS" | "NOT-COMPLETE";

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
	reps: number;
	exercise: string;
}
