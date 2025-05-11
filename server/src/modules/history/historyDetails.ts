import { normalizeWorkout } from "../workouts/workouts.ts";
import { normalizeHistoryEntryByType } from "./allHistory.ts";
import type { HistoryDetails, HistoryDetailsDB } from "./types.ts";

const normalizeHistoryDetails = (details: HistoryDetailsDB): HistoryDetails => {
	const { workout, history, activityType } = details;

	const workoutEntry = normalizeWorkout(workout);
	const historyEntry = normalizeHistoryEntryByType(activityType, history);
	const historyDetails: HistoryDetails = {
		workout: workoutEntry,
		history: historyEntry,
		activityType,
	};
	return historyDetails;
};

export { normalizeHistoryDetails };
