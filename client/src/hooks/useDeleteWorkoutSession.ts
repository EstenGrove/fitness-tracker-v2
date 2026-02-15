import { useDeleteWorkoutSessionMutation } from "../features/history/historyApi";

const useDeleteWorkoutSession = () => {
	const [deleteSession, { isLoading, error, isSuccess }] =
		useDeleteWorkoutSessionMutation();

	return { deleteSession, isLoading, error, isSuccess };
};

export { useDeleteWorkoutSession };
