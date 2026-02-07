import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { Activity } from "../features/shared/types";
import { useGetWorkoutRecapQuery } from "../features/workout-recaps/api";
import { ActivityRecapDetails } from "../features/workout-recaps/types";

interface RecapParams {
	activityType: Activity;
	workoutID: number;
	lastXDays: number;
}

const useWorkoutRecap = ({
	workoutID,
	activityType,
	lastXDays,
}: RecapParams) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID && activityType && workoutID);
	const { data, isLoading, refetch } = useGetWorkoutRecapQuery(
		{
			userID: currentUser?.userID,
			workoutID,
			activityType,
			lastXDays,
		},
		{ skip: !shouldFetch }
	);
	const recapData = data as ActivityRecapDetails;

	return {
		data: recapData,
		isLoading,
		refetch,
	};
};

export { useWorkoutRecap };
