import { Activity } from "../features/shared/types";
import { AsyncResponse } from "../features/types";
import { TodaysWorkout, WorkoutDetails } from "../features/workouts/types";
import { currentEnv, workoutApis } from "./utils_env";

export type TodaysWorkoutsResp = AsyncResponse<TodaysWorkout[]>;
export type WorkoutDetailsResp = AsyncResponse<WorkoutDetails>;

const fetchTodaysWorkouts = async (
	userID: string,
	targetDate: string
): TodaysWorkoutsResp => {
	let url = currentEnv.base + workoutApis.getTodaysWorkouts;
	url += "?" + new URLSearchParams({ userID, targetDate });

	try {
		const request = await fetch(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

const fetchWorkoutDetails = async (
	userID: string,
	workoutID: number,
	activityType: Activity
): WorkoutDetailsResp => {
	let url = currentEnv.base + workoutApis.getWorkoutDetails;
	url +=
		"?" +
		new URLSearchParams({ userID, workoutID: String(workoutID), activityType });

	try {
		const request = await fetch(url);
		const response = await request.json();

		return response;
	} catch (error) {
		return error;
	}
};

export { fetchTodaysWorkouts, fetchWorkoutDetails };
