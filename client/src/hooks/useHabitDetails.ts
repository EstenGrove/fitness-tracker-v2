import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHabitDetailsQuery } from "../features/habits/habitsApi";
import { HabitDetails } from "../features/habits/types";

const useHabitDetails = (habitID: number, targetDate: string) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetHabitDetailsQuery(
		{
			userID: currentUser?.userID,
			habitID: habitID,
			targetDate: targetDate,
		},
		{ skip: !shouldFetch }
	);
	const details = data as HabitDetails;

	return {
		isLoading: isLoading,
		data: details,
		refetch: refetch,
	};
};

export { useHabitDetails };
