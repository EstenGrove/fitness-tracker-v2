import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetAllWorkoutsQuery } from "../features/workouts/todaysWorkoutsApi";

/**
 * Wrapper hook for implementing 'skip' behavior for hook's automated re-fetching
 */

const useAllWorkouts = () => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data: workoutsList, isLoading } = useGetAllWorkoutsQuery(
		{
			userID: currentUser?.userID,
		},
		{ skip: !shouldFetch }
	);

	return {
		data: workoutsList,
		isLoading,
	};
};

export { useAllWorkouts };
