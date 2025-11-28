import { workoutsService } from "../../services/index.js";
import { normalizeHistoryByType } from "../history/allHistory.js";
import type {
	HistoryByType,
	HistoryByTypeDB,
	HistoryOfType,
	HistoryOfTypeDB,
} from "../history/types.js";
import type { Activity } from "../types.js";
import {
	normalizeWorkoutInfo,
	type WorkoutDetails,
	type WorkoutDetailsDB,
} from "./normalizeWorkoutByType.js";
import type {
	WorkoutByType,
	WorkoutOfType,
	WorkoutSchedule,
	WorkoutScheduleDB,
} from "./types.js";

export interface WorkoutDetailsInfo {
	workout: WorkoutOfType;
	schedule: WorkoutSchedule;
	history: HistoryOfType[];
}
export interface WorkoutDetailsInfoDB {
	workout: Array<WorkoutOfType>;
	schedule: Array<WorkoutSchedule>;
	history: HistoryOfType[];
}

const getAllWorkoutDetails = async <T>(
	userID: string,
	workoutID: number,
	activityType: Activity
): Promise<WorkoutDetailsInfo | unknown> => {
	const data = (await workoutsService.getAllWorkoutDetails(
		userID,
		workoutID,
		activityType
	)) as WorkoutDetailsInfoDB;

	if (data instanceof Error) {
		return data;
	}

	console.log("DATA:", data);

	const workout = data.workout[0];
	const schedule = data.schedule[0];
	const history = data.history;

	const details: WorkoutDetailsInfo = {
		workout,
		schedule,
		history,
	};

	return details;
};

export { getAllWorkoutDetails };
