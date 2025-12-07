import type { Activity } from "../types.js";
import type { WorkoutByTypeDB, WorkoutSet } from "./types.js";

export interface WorkoutDetailsDB {
	user_id: string;
	workout_id: number;
	activity_type: Activity;
	workout_name: string;
	workout_desc: string;
	duration: number;
	equipment: string | null;
	tag_color: string | null;
	is_active: boolean;
	created_date: string;
	// added type fields
	sets?: WorkoutSet[];
	steps?: number;
	miles?: number;
	pace?: number;
}
export interface WorkoutDetails {
	userID: string;
	workoutID: number;
	activityType: Activity;
	workoutName: string;
	duration: number;
	equipment: string | null;
	tagColor: string | null;
	isActive: boolean;
	createdDate: string;
	// added type fields
	sets?: WorkoutSet[];
	steps?: number;
	miles?: number;
	pace?: number;
}

const normalizeWorkoutInfo = (
	activityType: Activity,
	workout: WorkoutDetailsDB
): WorkoutDetails => {
	const hasSets = Boolean("sets" in workout);
	const hasSteps = Boolean("steps" in workout);
	const baseFields = {
		userID: workout.user_id,
		workoutID: workout.workout_id,
		activityType: activityType,
		workoutName: workout.workout_name,
		workoutDesc: workout.workout_desc,
		duration: workout.duration,
		equipment: workout.equipment,
		tagColor: workout.tag_color,
		isActive: workout.is_active,
		createdDate: workout.created_date,
	};

	if (hasSets) {
		const details: WorkoutDetails = {
			...baseFields,
			sets: workout.sets,
		};
		return details;
	} else if (hasSteps) {
		const details: WorkoutDetails = {
			...baseFields,
			steps: workout.steps,
			miles: workout.miles,
			pace: workout.pace,
		};
		return details;
	} else {
		return baseFields;
	}
};

export { normalizeWorkoutInfo };
