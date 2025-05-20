import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetRecentHabitLogsQuery } from "../features/habits/habitsApi";
import { RecentHabitLog } from "../features/habits/types";

const useRecentHabitLogs = (targetDate: string, lastXDays: number = 3) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetRecentHabitLogsQuery(
		{
			userID: currentUser?.userID,
			targetDate: targetDate,
			lastXDays: lastXDays,
		},
		{ skip: !shouldFetch }
	);
	const recentLogs = data as RecentHabitLog[];

	return {
		data: recentLogs,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useRecentHabitLogs };
