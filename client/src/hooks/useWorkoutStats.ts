import { useSelector } from "react-redux";
import { Activity } from "../features/shared/types";
import { PostWorkoutStats } from "../features/stats/types";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetWorkoutStatsQuery } from "../features/stats/statsApi";

const useWorkoutStats = (historyID: number, activityType: Activity) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading } = useGetWorkoutStatsQuery(
		{
			userID: currentUser?.userID,
			historyID: historyID,
			activityType: activityType,
		},
		{ skip: !shouldFetch }
	);
	const stats = data as PostWorkoutStats;

	return {
		data: stats,
		isLoading: isLoading,
	};
};

export { useWorkoutStats };
