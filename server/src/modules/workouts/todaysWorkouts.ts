import type { TodaysWorkoutClient, TodaysWorkoutDB } from "./types.ts";

const normalizeTodaysWorkout = (
	workout: TodaysWorkoutDB
): TodaysWorkoutClient => {
	const client: TodaysWorkoutClient = {
		userID: workout.user_id,
		workoutID: workout.workout_id,
		activityType: workout.activity_type,
		workoutName: workout.workout_name,
		workoutStatus: workout.workout_status,
		duration: workout.duration,
		startTime: workout.start_time,
		endTime: workout.end_time,
		isRecurring: workout.is_recurring,
		recordedDuration: workout.recorded_duration,
	};
	return client;
};

export { normalizeTodaysWorkout };
