import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
	selectActiveWorkout,
	setActiveWorkout,
} from "../features/workouts/workoutsSlice";
import { TodaysWorkout } from "../features/workouts/types";
import {
	checkForActiveWorkout,
	checkForActiveWorkoutInfo,
} from "../utils/utils_workouts";
import { useAppDispatch } from "../store/store";
import { JsonValue, LocalStorage } from "../utils/utils_storage";
import { useLocation, useNavigate, Location } from "react-router";

const storage = new LocalStorage();
const ACTIVE_KEY = "ACTIVE";

/**
 * Hook to resume an active or on-going workout. (perhaps after force logout or re-login)
 * @param onGoTo - Callback that's invoked when an active workout is found & we navigate to it
 * @returns {activeWorkout, resume} - The active workout and the resume function
 */

// ActiveWorkoutPage: '/active/:id'
// - checks if we're on the active workout page
const isOnActivePage = (location: Location) => {
	return location.pathname.includes("/active/");
};

const useResumeActiveWorkout = (onGoTo?: (workout: TodaysWorkout) => void) => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();
	const activeWorkout: TodaysWorkout = useSelector(selectActiveWorkout);
	const isWorkoutPage = isOnActivePage(location);
	const activeWorkoutInfo = checkForActiveWorkoutInfo();

	const resume = () => {
		if (isWorkoutPage) return;

		const workout = checkForActiveWorkout();
		const currentWorkout = activeWorkout || workout;

		if (currentWorkout) {
			const id = currentWorkout.workoutID;
			const type = currentWorkout.activityType;
			navigate(`/active/${id}?type=${type}`);

			return onGoTo && onGoTo(currentWorkout);
		}
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (isWorkoutPage) return;

		// If no active workout in store, then check local storage
		if (!activeWorkout) {
			const workout = checkForActiveWorkout();
			if (!workout) return;
			dispatch(setActiveWorkout(workout as TodaysWorkout));
		} else {
			// If there's an active workout, then sync it to local storage for resume support
			storage.set(ACTIVE_KEY, activeWorkout as unknown as JsonValue);
		}

		return () => {
			isMounted = false;
		};
	}, [activeWorkout, dispatch, isWorkoutPage]);

	return {
		activeWorkout: activeWorkoutInfo,
		resume: resume,
	};
};

export { useResumeActiveWorkout };
