import { workoutsService } from "../../services/index.js";
import type { SkippedResp } from "../../services/WorkoutsService.js";
import type { SkippedWorkoutDB, SkipWorkoutBody } from "./types.js";

const skipWorkout = async (userID: string, values: SkipWorkoutBody) => {
	const resp = (await workoutsService.skipWorkout(
		userID,
		values
	)) as SkippedWorkoutDB;

	if (resp instanceof Error) {
		return {
			error: resp,
			wasSkipped: false,
		};
	} else {
		return {
			error: null,
			wasSkipped: resp.was_skipped,
		};
	}
};

export { skipWorkout };
