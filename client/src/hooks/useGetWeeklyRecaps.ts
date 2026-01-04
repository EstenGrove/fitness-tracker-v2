import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { RangeParams } from "../features/types";
import { useGetWeeklyRecapsQuery } from "../features/recaps/api";
import { WeeklyRecaps } from "../features/recaps/types";

/**
 * Fetches weekly recaps for 3 separate weeks at a time.
 * @param dateRange {startDate: string, endDate: string}
 * @returns WeeklyRecaps - a record containing weekly recaps for the current week, last week & 2 weeks ago
 */

const useGetWeeklyRecaps = (dateRange: RangeParams) => {
	const { startDate, endDate } = dateRange;
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID && startDate && endDate);
	const { data, isLoading, refetch } = useGetWeeklyRecapsQuery(
		{
			userID: currentUser?.userID,
			startDate: startDate,
			endDate: endDate,
		},
		{ skip: !shouldFetch }
	);
	const recap = data as WeeklyRecaps;

	return {
		data: recap,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useGetWeeklyRecaps };
