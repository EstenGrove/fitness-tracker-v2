import { useSelector } from "react-redux";
import { Activity } from "../features/shared/types";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetRecurringWorkoutDataQuery } from "../features/workouts/todaysWorkoutsApi";
import { RecurringWorkoutData } from "../features/workouts/types";

interface HookParams {
	workoutID: number;
	activityType: Activity;
}

const useGetRecurringWorkoutData = ({
	workoutID,
	activityType,
}: HookParams) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID && workoutID && activityType);
	const { data, isLoading, refetch } = useGetRecurringWorkoutDataQuery(
		{ userID: currentUser?.userID, workoutID, activityType },
		{ skip: !shouldFetch }
	);
	const recurringData = data as RecurringWorkoutData;

	return {
		data: recurringData,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useGetRecurringWorkoutData };
