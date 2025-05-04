import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetSkippedWorkoutsQuery } from "../features/workouts/todaysWorkoutsApi";

/**
 * Wrapper hook for implementing 'skip' behavior for hook's automated re-fetching
 * - List of skipped workouts
 */

const useSkippedWorkouts = (targetDate: string) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading } = useGetSkippedWorkoutsQuery(
		{
			userID: currentUser?.userID,
			targetDate: targetDate,
		},
		{ skip: !shouldFetch }
	);

	return {
		data,
		isLoading,
	};
};

export { useSkippedWorkouts };
