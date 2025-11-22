import { workoutsService } from "../../services/index.js";
import { normalizeTodaysWorkout } from "./todaysWorkouts.js";
import type { TodaysWorkoutClient, TodaysWorkoutDB } from "./types.js";

export type TodaysUnscheduledResp = Promise<TodaysWorkoutClient[] | unknown>;

const getTodaysUnscheduled = async (
	userID: string,
	targetDate: string
): TodaysUnscheduledResp => {
	const data = (await workoutsService.getTodaysUnscheduled(
		userID,
		targetDate
	)) as TodaysWorkoutDB[];

	if (data instanceof Error) {
		return data;
	}

	const completedToday: TodaysWorkoutClient[] = data.map(
		normalizeTodaysWorkout
	);

	return completedToday;
};

export { getTodaysUnscheduled };
