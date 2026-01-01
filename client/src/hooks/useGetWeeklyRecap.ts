import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { RangeParams } from "../features/types";
import { useGetWeeklyRecapQuery } from "../features/recaps/api";
import { WeeklyRecap } from "../features/recaps/types";

const useGetWeeklyRecap = (dateRange: RangeParams) => {
	const { startDate, endDate } = dateRange;
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID && startDate && endDate);
	const { data, isLoading, refetch } = useGetWeeklyRecapQuery(
		{
			userID: currentUser?.userID,
			startDate: startDate,
			endDate: endDate,
		},
		{ skip: !shouldFetch }
	);
	const recap = data as WeeklyRecap;

	return {
		data: recap,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useGetWeeklyRecap };
