import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetAllUserWorkoutsQuery } from "../features/workouts/todaysWorkoutsApi";
import { TodaysWorkout } from "../features/workouts/types";

/**
 * Wrapper hook for implementing 'skip' behavior for hook's automated re-fetching
 */

const useAllUserWorkouts = () => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data = [], isLoading } = useGetAllUserWorkoutsQuery(
		{
			userID: currentUser?.userID,
		},
		{ skip: !shouldFetch }
	);
	const workouts = data as TodaysWorkout[];

	return {
		data: workouts,
		isLoading,
	};
};

export { useAllUserWorkouts };
