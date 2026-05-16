import { useSelector } from "react-redux";
import {
	ActivityMetricsDataParams,
	useGetActivityMetricsAfterWorkoutQuery,
} from "../features/metrics/api";
import { ActivityMetrics } from "../features/metrics/types";
import { selectCurrentUser } from "../features/user/userSlice";

const useActivityMetricsAfterWorkout = (params: ActivityMetricsDataParams) => {
	const { activityType, workoutID, historyID, range } = params;
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(
		currentUser?.userID && activityType && workoutID && historyID && range,
	);
	const { data, isLoading, refetch } = useGetActivityMetricsAfterWorkoutQuery(
		{
			userID: currentUser?.userID,
			activityType,
			workoutID,
			historyID,
			range,
		},
		{ skip: !shouldFetch },
	);

	const metrics = data as ActivityMetrics;

	return { data: metrics, isLoading, refetch };
};

export { useActivityMetricsAfterWorkout };
