import { workoutsService } from "../../services/index.ts";
import type { SkippedResp } from "../../services/WorkoutsService.ts";
import type { SkippedWorkoutDB, SkipWorkoutBody } from "./types.ts";

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
