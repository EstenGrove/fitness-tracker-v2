import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHabitHistoryQuery } from "../features/habits/habitsApi";

const useHabitHistory = (habitID: number, lastXDays: number = 60) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetHabitHistoryQuery(
		{
			userID: currentUser?.userID,
			habitID: habitID,
			lastXDays: lastXDays || 60,
		},
		{ skip: !shouldFetch }
	);

	return { data, isLoading, refetch };
};

export { useHabitHistory };
