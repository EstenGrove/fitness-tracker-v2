import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetTodaysUnscheduledWorkoutsQuery } from "../features/workouts/todaysWorkoutsApi";
import { TodaysWorkout } from "../features/workouts/types";

const useTodaysUnscheduledWorkouts = (targetDate: string) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID && targetDate);
	const { data, isLoading, refetch } = useGetTodaysUnscheduledWorkoutsQuery(
		{
			userID: currentUser?.userID,
			targetDate: targetDate,
		},
		{ skip: !shouldFetch }
	);
	const completedToday = data as TodaysWorkout[];

	return {
		data: completedToday,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useTodaysUnscheduledWorkouts };
