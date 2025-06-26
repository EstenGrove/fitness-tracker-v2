import {
	normalizeHistoryByType,
	normalizeHistoryEntryByType,
} from "../history/allHistory.js";
import type { Activity } from "../types.js";
import { normalizeTodaysWorkout } from "./todaysWorkouts.js";
import type {
	StrengthWorkoutDB,
	TodaysWorkoutClient,
	WorkoutByTypeDB,
	WorkoutDetails,
	WorkoutDetailsDB,
	WorkoutOfType,
	WorkoutOfTypeDB,
} from "./types.js";
import { normalizeWorkout } from "./workouts.js";
import { normalizeWorkoutSchedule } from "./workoutSchedule.js";

const normalizeWorkoutByType = (
	type: Activity,
	workout: WorkoutOfTypeDB
): WorkoutOfType => {
	switch (type) {
		case "Strength": {
			const entry = workout as StrengthWorkoutDB;
			const newWorkout = normalizeWorkout(workout);

			return {
				...newWorkout,
				sets: entry.sets,
				reps: entry.reps,
				weight: entry.weight,
			};
		}
		case "Walk": {
			const entry = workout as WorkoutByTypeDB<{
				steps: number;
				miles: number;
				pace: number;
			}>;
			const newWorkout = normalizeWorkout(entry);
			return {
				...newWorkout,
				steps: entry?.steps,
				miles: entry?.miles,
				pace: entry?.pace,
			};
		}
		case "Timed":
		case "Other":
		case "Stretch":
		case "Cardio": {
			const entry = workout as WorkoutByTypeDB<{
				sets: number;
				reps: number;
				exercise: string;
			}>;
			const newWorkout = normalizeWorkout(entry);
			return {
				...newWorkout,
				sets: entry?.sets,
				reps: entry?.reps,
				exercise: entry?.exercise,
			};
		}
		default:
			throw new Error(`Unknown workout type: ${type}`);
	}
};

const normalizeWorkoutDetails = (
	type: Activity,
	details: WorkoutDetailsDB
): WorkoutDetails => {
	const { workout, schedule, history } = details;

	const clientWorkout: WorkoutOfType = normalizeWorkoutByType(
		type,
		workout as WorkoutOfTypeDB
	);
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
