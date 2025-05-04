import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetActivitySummaryQuery } from "../features/recent-activity/recentActivityApi";
import {
	ActivityRangeType,
	ActivitySummaryFor,
} from "../features/recent-activity/types";

const useRecentActivitySummary = (
	rangeType: ActivityRangeType,
	targetDate: string
) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading } = useGetActivitySummaryQuery(
		{
			userID: currentUser?.userID,
			targetDate: targetDate,
			rangeType: rangeType,
		},
		{ skip: !shouldFetch }
	);
	const activitySummary = data as ActivitySummaryFor;

	return {
		data: activitySummary,
		isLoading: isLoading,
	};
};

export { useRecentActivitySummary };
