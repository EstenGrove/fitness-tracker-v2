import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { formatDate } from "../utils/utils_dates";
import { useGetWorkoutStreaksQuery } from "../features/streaks/api";
import { WorkoutStreakDetails } from "../features/streaks/types";

const useWorkoutStreaks = (date: Date | string = new Date()) => {
	const targetDate = formatDate(date, "db");
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID && targetDate);
	const { data, isLoading, refetch } = useGetWorkoutStreaksQuery(
		{
			userID: currentUser?.userID,
			targetDate: targetDate,
		},
		{ skip: !shouldFetch }
	);
	const streaksData = data as WorkoutStreakDetails;

	return {
		refetch: refetch,
		data: streaksData,
		isLoading: isLoading,
	};
};

export { useWorkoutStreaks };
