import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { formatDate } from "../utils/utils_dates";
import { WorkoutAwardsAndStreaks } from "../features/awards/types";
import { useGetWorkoutAwardsAndStreaksQuery } from "../features/awards/api";

const useWorkoutStreaksAndAwards = (date: Date | string = new Date()) => {
	const targetDate = formatDate(date, "db");
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID && targetDate);
	const { data, isLoading, refetch } = useGetWorkoutAwardsAndStreaksQuery(
		{
			userID: currentUser?.userID,
			targetDate: targetDate,
		},
		{ skip: !shouldFetch },
	);

	const awardsData = data as WorkoutAwardsAndStreaks;

	return {
		data: awardsData,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useWorkoutStreaksAndAwards };
