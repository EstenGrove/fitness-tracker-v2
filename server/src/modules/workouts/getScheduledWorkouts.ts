import { workoutsService } from "../../services/index.js";
import type { DateRange } from "../types.js";
import { normalizeTodaysWorkout } from "./todaysWorkouts.js";
import type { ScheduledWorkoutClient, ScheduledWorkoutDB } from "./types.js";

type GroupedWorkoutsDB = Record<string, ScheduledWorkoutDB[]>;
type GroupedWorkouts = Record<string, ScheduledWorkoutClient[]>;

const normalizeScheduledWorkouts = (
	workouts: ScheduledWorkoutDB[]
): ScheduledWorkoutClient[] => {
	if (!workouts || !workouts.length) return [];

	return workouts.map((workout) => ({
		userID: workout.user_id,
		workoutID: workout.workout_id,
		workoutDate: workout.workout_date,
		workoutName: workout.workout_name,
		activityType: workout.activity_type,
		duration: workout.duration,
		startTime: workout.start_time,
		endTime: workout.end_time,
		isRecurring: workout.is_recurring,
		workoutStatus: workout.workout_status,
		recordedDuration: workout.recorded_duration,
	}));
};

const normalizeGroupedWorkouts = (
	workoutsGroup: GroupedWorkoutsDB
): GroupedWorkouts => {
	const normed = {} as GroupedWorkouts;

	for (const key in workoutsGroup) {
		const workoutsForDate: ScheduledWorkoutDB[] = workoutsGroup[key];
		const normal = normalizeScheduledWorkouts(workoutsForDate);
		normed[key] = normal;
	}

	return normed;
};

const getScheduledWorkouts = async (userID: string, dateRange: DateRange) => {
	const { startDate, endDate } = dateRange;

	try {
		const results = (await workoutsService.getScheduledWorkouts(userID, {
			startDate,
			endDate,
		})) as ScheduledWorkoutDB[];
		const scheduled = normalizeScheduledWorkouts(results);
		return scheduled;
	} catch (error) {
		return error;
	}
};
const getScheduledWorkoutsGrouped = async (
	userID: string,
	dateRange: DateRange
) => {
	const { startDate, endDate } = dateRange;

	try {
		const results = (await workoutsService.getScheduledWorkoutsGrouped(userID, {
			startDate,
			endDate,
		})) as GroupedWorkoutsDB;
		const grouped: GroupedWorkouts = normalizeGroupedWorkouts(results);
		return grouped;
	} catch (error) {
		return error;
	}
};

export { getScheduledWorkouts, getScheduledWorkoutsGrouped };
