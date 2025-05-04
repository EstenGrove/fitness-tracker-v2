import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { formatDate } from "../utils/utils_dates";
import { useGetHistoryByRangeAndTypeQuery } from "../features/history/historyApi";
import { Activity } from "../features/shared/types";

/**
 * Wrapper hook for implementing 'skip' behavior for hook's automated re-fetching
 */

interface HookParams {
	startDate: Date | string;
	endDate: Date | string;
	activityType: Activity;
}

const useHistoryForRangeAndType = <T>(params: HookParams) => {
	const { startDate, endDate, activityType } = params;
	const currentUser = useSelector(selectCurrentUser);
	const shouldRefresh = Boolean(currentUser?.userID);
	const { data, isLoading } = useGetHistoryByRangeAndTypeQuery(
		{
			userID: currentUser?.userID,
			startDate: formatDate(startDate, "db"),
			endDate: formatDate(endDate, "db"),
			activityType: activityType,
		},
		{ skip: !shouldRefresh }
	);
	const allHistory = data as T[];

	return {
		data: allHistory,
		isLoading: isLoading,
	};
};

export { useHistoryForRangeAndType };
