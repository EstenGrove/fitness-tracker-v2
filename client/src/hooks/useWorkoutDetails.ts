import { useSelector } from "react-redux";
import { Activity } from "../features/shared/types";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetWorkoutDetailsQuery } from "../features/workouts/todaysWorkoutsApi";
import { WorkoutDetails } from "../features/workouts/types";

type HookParams = {
	workoutID: number;
	activityType: Activity;
};

const useWorkoutDetails = ({ workoutID, activityType }: HookParams) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID && workoutID && activityType);
	const { data, isLoading, refetch } = useGetWorkoutDetailsQuery(
		{
			userID: currentUser?.userID,
			workoutID,
			activityType,
		},
		{ skip: !shouldFetch }
	);
	const details = data as WorkoutDetails;

	return {
		data: details,
		isLoading,
		refetch,
	};
};

export { useWorkoutDetails };
