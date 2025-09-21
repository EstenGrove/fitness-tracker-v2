import { summaryService } from "../../services/index.js";
import {
	normalizeHistoryByType,
	normalizeHistoryEntryByType,
} from "../history/allHistory.js";
import type {
	HistoryOfType,
	HistoryOfTypeDB,
	WorkoutHistory,
	WorkoutHistoryDB,
} from "../history/types.js";
import { normalizeTodaysWorkout } from "../workouts/todaysWorkouts.js";
import type {
	TodaysWorkoutClient,
	TodaysWorkoutDB,
} from "../workouts/types.js";

export interface WorkoutCalendarDetailsDB {
	scheduled: TodaysWorkoutDB[];
	history: HistoryOfTypeDB[];
}
export interface WorkoutCalendarDetails {
	scheduledWorkouts: TodaysWorkoutClient[];
	performedWorkouts: HistoryOfType[];
}

const getWorkoutHistoryCalendarDetails = async (
	userID: string,
	targetDate: string
) => {
	const results = (await summaryService.getWorkoutHistoryCalendarDetails(
		userID,
		targetDate
	)) as WorkoutCalendarDetailsDB;

	if (results instanceof Error) {
		return results;
	}

	const scheduled = results?.scheduled?.map(normalizeTodaysWorkout);
	const performed = results?.history?.map((entry) => {
		const { activity_type } = entry;
		return normalizeHistoryEntryByType(activity_type, entry);
	});

	return {
		scheduledWorkouts: scheduled,
		performedWorkouts: performed,
	};
};

export { getWorkoutHistoryCalendarDetails };
