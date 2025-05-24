import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHabitCardsQuery } from "../features/habits/habitsApi";
import { HabitCard } from "../features/habits/types";

const useHabitCards = (targetDate: string) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetHabitCardsQuery(
		{
			userID: currentUser?.userID,
			targetDate: targetDate,
		},
		{ skip: !shouldFetch }
	);
	const cards = data as HabitCard[];

	return { data: cards, isLoading, refetch };
};

export { useHabitCards };
