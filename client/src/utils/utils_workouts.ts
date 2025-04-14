import { AsyncResponse } from "../features/types";
import { TodaysWorkout } from "../features/workouts/types";
import { currentEnv, workoutApis } from "./utils_env";

export type TodaysWorkoutsResp = AsyncResponse<TodaysWorkout[]>;

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

export { fetchTodaysWorkouts };
