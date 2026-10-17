import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetTrendCategoryQuery } from "../features/trends-hub/api";
import { TrendCategoryKey, TrendPeriodKey } from "../features/trends-hub/types";

/**
 * Fetches a trends category's full data (/trends/:category)
 * @param category - null when the route param isn't a valid category (skips the request)
 * @param period - eg. "12W" (see 'useTrendPeriod')
 * @returns categoryData - null while loading, on error, or for an invalid category
 */

const useTrendCategory = (
	category: TrendCategoryKey | null,
	period: TrendPeriodKey,
) => {
	const currentUser = useSelector(selectCurrentUser);
	const userID = currentUser?.userID;
	const shouldFetch = Boolean(userID && category);
	const { data, isLoading, isFetching, isError, refetch } =
		useGetTrendCategoryQuery(
			{ userID, category: category as TrendCategoryKey, period },
			{ skip: !shouldFetch },
		);

	return {
		categoryData: data ?? null,
		isLoading: isLoading,
		isFetching: isFetching, // true while switching periods (keeps the old data on screen)
		isError: isError,
		refetch: refetch,
	};
};

export { useTrendCategory };
