import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { formatDate } from "../utils/utils_dates";
import { AllHistory } from "../features/history/types";
import { useGetHistoryForRangeQuery } from "../features/history/historyApi";

/**
 * Wrapper hook for implementing 'skip' behavior for hook's automated re-fetching
 */

const useHistoryForRange = (
	startDate: Date | string,
	endDate: Date | string
) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading } = useGetHistoryForRangeQuery(
		{
			userID: currentUser?.userID,
			startDate: formatDate(startDate, "db"),
			endDate: formatDate(endDate, "db"),
		},
		{ skip: !shouldFetch }
	);
	const allHistory = data as AllHistory;

	return {
		data: allHistory,
		isLoading: isLoading,
	};
};

export { useHistoryForRange };
