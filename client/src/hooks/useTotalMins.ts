import { useSelector } from "react-redux";
import { useGetTotalMinsByQuery } from "../features/stats/statsApi";
import { RangeBy, TotalMinsBy } from "../utils/utils_stats";
import { selectCurrentUser } from "../features/user/userSlice";
import { StatsSummaryItem } from "../features/stats/types";

const useTotalMins = (targetDate: string, rangeType: RangeBy) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const {
		data: raw,
		refetch,
		isLoading,
	} = useGetTotalMinsByQuery(
		{
			userID: currentUser?.userID,
			targetDate: targetDate,
			by: rangeType,
		},
		{ skip: !shouldFetch }
	);
	const data = raw as StatsSummaryItem[];

	return { data, refetch, isLoading };
};

export { useTotalMins };
