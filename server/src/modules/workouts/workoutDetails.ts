import {
	normalizeHistoryByType,
	normalizeHistoryEntryByType,
} from "../history/allHistory.ts";
import { normalizeTodaysWorkout } from "./todaysWorkouts.ts";
import type {
	TodaysWorkoutClient,
	WorkoutDetails,
	WorkoutDetailsDB,
} from "./types.ts";
import { normalizeWorkoutSchedule } from "./workoutSchedule.ts";

const normalizeWorkoutDetails = (details: WorkoutDetailsDB): WorkoutDetails => {
	const { workout, schedule, history } = details;

	const clientWorkout: TodaysWorkoutClient = normalizeTodaysWorkout(workout);
	const clientSchedule = schedule ? normalizeWorkoutSchedule(schedule) : null;
	const clientHistory =
		history?.map((entry) =>
			normalizeHistoryEntryByType(entry.activity_type, entry)
		) || [];

	return {
		workout: clientWorkout,
		schedule: clientSchedule,
		history: clientHistory,
	};
};

export { normalizeWorkoutDetails };
