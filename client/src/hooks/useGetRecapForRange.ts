import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { RangeParams } from "../features/types";
import { useGetRecapForRangeQuery } from "../features/recaps/api";
import { RecapForRange } from "../features/recaps/types";

const useGetRecapForRange = (dateRange: RangeParams) => {
	const { startDate, endDate } = dateRange;
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID && startDate && endDate);
	const { data, isLoading, refetch } = useGetRecapForRangeQuery(
		{
			userID: currentUser?.userID,
			startDate: startDate,
			endDate: endDate,
		},
		{ skip: !shouldFetch }
	);
	const recap = data as RecapForRange;

	return {
		data: recap,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useGetRecapForRange };
