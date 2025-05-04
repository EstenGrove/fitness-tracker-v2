import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetDashboardSummaryQuery } from "../features/dashboard/summaryApi";
import { DashboardSummary } from "../features/dashboard/types";

const useDashboardSummary = (targetDate: string) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading } = useGetDashboardSummaryQuery(
		{
			userID: currentUser?.userID,
			targetDate: targetDate,
		},
		{ skip: !shouldFetch }
	);
	const summary = data as DashboardSummary;

	return {
		data: summary,
		isLoading: isLoading,
	};
};

export { useDashboardSummary };
