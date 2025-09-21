import {
	NewWorkoutParams,
	useCreateWorkoutMutation,
} from "../features/workouts/todaysWorkoutsApi";
import { CreatedWorkoutData } from "../features/workouts/types";

const useCreateWorkout = () => {
	const [createWorkout, { isLoading, isError, error, data }] =
		useCreateWorkoutMutation();
	const results = data as CreatedWorkoutData;

	const createNewWorkout = async (payload: NewWorkoutParams) => {
		await createWorkout(payload).unwrap();
	};

	return {
		data: results,
		isLoading: isLoading,
		error: isError ? error : null,
		createWorkout: createNewWorkout,
	};
};

export { useCreateWorkout };
