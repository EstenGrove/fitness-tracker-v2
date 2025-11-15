import { addMonths, subMonths } from "date-fns";
import { formatDate } from "../utils/utils_dates";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetScheduledWorkoutsQuery } from "../features/workouts/todaysWorkoutsApi";
import { ScheduledWorkout } from "../features/workouts/types";
import { groupByFn } from "../utils/utils_misc";

// Grabs 6 months in the past & 6 months in the future worth of data/workouts
const getDefaultRange = (base: Date = new Date()) => {
	const start = subMonths(base, 6);
	const end = addMonths(base, 6);

	return {
		startDate: formatDate(start, "db"),
		endDate: formatDate(end, "db"),
	};
};

const defaultRange = getDefaultRange();

type BaseRange = {
	startDate: string;
	endDate: string;
};

const useScheduledWorkouts = (dateRange: BaseRange = defaultRange) => {
	const { startDate, endDate } = dateRange;
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID && startDate && endDate);
	const { data, isLoading, refetch } = useGetScheduledWorkoutsQuery(
		{
			userID: currentUser?.userID,
			startDate: startDate,
			endDate: endDate,
		},
		{ skip: !shouldFetch }
	);
	const scheduledWorkouts = data as ScheduledWorkout[];
	const byDate = groupByFn(scheduledWorkouts, (workout) =>
		formatDate(workout.workoutDate, "db")
	);

	return {
		data: {
			list: scheduledWorkouts,
			grouped: byDate,
		},
		isLoading,
		refetch,
	};
};

export { useScheduledWorkouts };
