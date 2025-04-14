import type { Activity } from "../types.ts";

export type WorkoutStatus = "COMPLETE" | "NOT-COMPLETE";

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
