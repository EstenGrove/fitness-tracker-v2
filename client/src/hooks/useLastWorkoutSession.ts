import { useSelector } from "react-redux";
import { LastSessionParams } from "../utils/utils_workouts";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetLastWorkoutQuery } from "../features/stats/statsApi";
import { HistoryOfType } from "../features/history/types";

const useLastWorkoutSession = (params: Omit<LastSessionParams, "userID">) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetLastWorkoutQuery(
		{
			...params,
			userID: currentUser?.userID,
		},
		{ skip: !shouldFetch }
	);
	const lastSession = data as HistoryOfType;
	console.log("lastSession", lastSession);

	return {
		refetch: refetch,
		data: lastSession,
		isLoading: isLoading,
	};
};

export { useLastWorkoutSession };
