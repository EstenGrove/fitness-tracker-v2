import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetWorkoutHistoryCalendarQuery } from "../features/summary/summaryApi";
import { WorkoutCalendarData } from "../utils/utils_summary";

const useWorkoutHistoryCalendar = (baseDate: string) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetWorkoutHistoryCalendarQuery(
		{
			userID: currentUser?.userID,
			baseDate: baseDate,
		},
		{ skip: !shouldFetch }
	);
	const calendarData = data as WorkoutCalendarData;

	return {
		data: calendarData,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useWorkoutHistoryCalendar };
