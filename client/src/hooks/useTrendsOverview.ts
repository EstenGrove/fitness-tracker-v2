import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetTrendsOverviewQuery } from "../features/trends-hub/api";
import { TrendPeriodKey } from "../features/trends-hub/types";

/**
 * Fetches the trends hub (/trends): one card per category for the given period
 * @param period - eg. "12W" (see 'useTrendPeriod')
 * @returns overview - null while loading or on error
 */

const useTrendsOverview = (period: TrendPeriodKey) => {
	const currentUser = useSelector(selectCurrentUser);
	const userID = currentUser?.userID;
	const { data, isLoading, isFetching, isError, refetch } =
		useGetTrendsOverviewQuery({ userID, period }, { skip: !userID });

	return {
		overview: data ?? null,
		isLoading: isLoading,
		isFetching: isFetching, // true while switching periods (keeps the old data on screen)
		isError: isError,
		refetch: refetch,
	};
};

export { useTrendsOverview };
