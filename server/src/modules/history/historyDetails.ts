import { normalizeWorkout } from "../workouts/workouts.js";
import { normalizeHistoryEntryByType } from "./allHistory.js";
import type { HistoryDetails, HistoryDetailsDB } from "./types.js";

const normalizeHistoryDetails = (details: HistoryDetailsDB): HistoryDetails => {
	const { workout, history, activityType, calories } = details;

	const workoutEntry = normalizeWorkout(workout);
	const historyEntry = normalizeHistoryEntryByType(activityType, {
		...history,
		calories,
	});
	const historyDetails: HistoryDetails = {
		workout: workoutEntry,
		history: historyEntry,
		activityType,
	};
	return historyDetails;
};

export { normalizeHistoryDetails };
