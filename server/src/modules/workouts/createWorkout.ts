import { workoutsService } from "../../services/index.js";
import type {
	CreateWorkoutParams,
	Workout,
	WorkoutDB,
	WorkoutSchedule,
	WorkoutScheduleDB,
} from "./types.js";
import { normalizeWorkout } from "./workouts.js";
import { normalizeWorkoutSchedule } from "./workoutSchedule.js";

export interface NewWorkoutDataDB {
	workout: WorkoutDB;
	schedule: WorkoutScheduleDB;
}
export interface NewWorkoutData {
	workout: Workout;
	schedule: WorkoutSchedule;
}

export type NewWorkoutResp = Promise<NewWorkoutData | Error>;

const createOneTimeWorkout = async (
	payload: CreateWorkoutParams
): NewWorkoutResp => {
	const results = (await workoutsService.createOneTimeWorkout(
		payload
	)) as NewWorkoutDataDB;

	if (results instanceof Error) {
		return results;
	}
	const workout = normalizeWorkout(results.workout);
	const schedule = normalizeWorkoutSchedule(results.schedule);

	const response = {
		workout: workout,
		schedule: schedule,
	};
	return response;
};

const createRecurringWorkout = async (
	payload: CreateWorkoutParams
): NewWorkoutResp => {
	const results = await workoutsService.createRecurringWorkout(payload);

	if (results instanceof Error) {
		return results;
	}

	const workout = normalizeWorkout(results.workout);
	const schedule = normalizeWorkoutSchedule(results.schedule);

	const response = {
		workout: workout,
		schedule: schedule,
	};
	return response;
};

const createWorkout = async (payload: CreateWorkoutParams): NewWorkoutResp => {
	const { workout } = payload;
	const isRecurring = workout.isRecurring || false;

	if (isRecurring) {
		const results = await createRecurringWorkout(payload);
		return results;
	} else {
		const results = await createOneTimeWorkout(payload);
		return results;
	}
};

export { createWorkout, createOneTimeWorkout, createRecurringWorkout };
