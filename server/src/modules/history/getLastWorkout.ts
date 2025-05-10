import { historyService } from "../../services/index.ts";
import type { WorkoutHistoryDB } from "./types.ts";

export interface LastSessionParams {
	userID: string;
	workoutID: number;
	activityType: string;
	targetDate: string;
}

const getLastWorkoutByDate = async (
	params: LastSessionParams
): Promise<WorkoutHistoryDB | unknown> => {
	try {
		const data = await historyService.getMostRecentSession(params);
		console.log("data", data);
		const lastSession = data;

		return lastSession;
	} catch (error) {
		return error;
	}
};

export { getLastWorkoutByDate };
