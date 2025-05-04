import type { Activity } from "../types.ts";

export interface PostWorkoutParams {
	userID: string;
	workoutID: number;
	historyID: number;
	activityType: Activity;
}
