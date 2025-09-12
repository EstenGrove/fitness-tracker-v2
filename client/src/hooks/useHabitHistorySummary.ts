import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHabitHistorySummaryQuery } from "../features/habits/habitsApi";
import { HabitYearSummary } from "../features/habits/types";

const useHabitHistorySummary = (habitID: number, year: number) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, refetch, isLoading } = useGetHabitHistorySummaryQuery(
		{ userID: currentUser?.userID, habitID, year },
		{ skip: !shouldFetch }
	);
	const summary = data as HabitYearSummary;

	return {
		data: summary,
		refetch,
		isLoading,
	};
};

export { useHabitHistorySummary };
