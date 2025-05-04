import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetTodaysWorkoutsQuery } from "../features/workouts/todaysWorkoutsApi";

/**
 * Wrapper hook for implementing 'skip' behavior for hook's automated re-fetching
 */

const useTodaysWorkouts = (targetDate: string) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading } = useGetTodaysWorkoutsQuery(
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

export { useTodaysWorkouts };
