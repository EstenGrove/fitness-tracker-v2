import { useSelector } from "react-redux";
import { Activity } from "../features/shared/types";
import { PostWorkoutStats, PostWorkoutDetails } from "../features/stats/types";
import { selectCurrentUser } from "../features/user/userSlice";
import {
	useGetPostWorkoutDetailsQuery,
	useGetPostWorkoutStatsQuery,
} from "../features/stats/statsApi";

const usePostWorkoutStats = (workoutID: number, activityType: Activity) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetPostWorkoutStatsQuery(
		{
			userID: currentUser?.userID,
			workoutID: workoutID,
			activityType: activityType,
		},
		{ skip: !shouldFetch }
	);
	const stats = data as PostWorkoutStats;

	return {
		data: stats,
		refetch: refetch,
		isLoading: isLoading,
	};
};

const usePostWorkoutDetails = (workoutID: number, activityType: Activity) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetPostWorkoutDetailsQuery(
		{
			userID: currentUser?.userID,
			workoutID: workoutID,
			activityType: activityType,
		},
		{ skip: !shouldFetch }
	);
	const stats = data as PostWorkoutDetails;

	return {
		data: stats,
		refetch: refetch,
		isLoading: isLoading,
	};
};

export { usePostWorkoutStats, usePostWorkoutDetails };
