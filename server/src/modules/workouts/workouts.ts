import type { Workout, WorkoutDB } from "./types.js";

const normalizeWorkout = (workout: WorkoutDB): Workout => {
	return {
		userID: workout.user_id,
		workoutID: workout.workout_id,
		activityType: workout.activity_type,
		workoutName: workout.workout_name,
		duration: workout.duration,
		equipment: workout.equipment,
		tagColor: workout.tag_color,
	};
};

const normalizeWorkouts = (workouts: WorkoutDB[]): Workout[] => {
	if (!workouts || workouts.length === 0) return [];
	return workouts.map(normalizeWorkout);
};

export { normalizeWorkout, normalizeWorkouts };
