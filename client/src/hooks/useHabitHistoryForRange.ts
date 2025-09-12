import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHabitHistoryForRangeQuery } from "../features/habits/habitsApi";
import { HabitHistoryByRange } from "../utils/utils_habits";

export interface HistoryByRangeParams {
	habitID: number;
	startDate: string;
	endDate: string;
	skip: boolean;
}

const useHabitHistoryForRange = (params: HistoryByRangeParams) => {
	const { habitID, startDate, endDate } = params;
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, refetch, isLoading } = useGetHabitHistoryForRangeQuery(
		{
			userID: currentUser?.userID,
			habitID: habitID,
			startDate: startDate,
			endDate: endDate,
		},
		{ skip: !shouldFetch || params.skip }
	);
	const rangeHistory = data as HabitHistoryByRange;

	return {
		data: rangeHistory,
		refetch: refetch,
		isLoading: isLoading,
	};
};

export { useHabitHistoryForRange };
