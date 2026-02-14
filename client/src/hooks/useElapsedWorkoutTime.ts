import { useEffect, useState } from "react";
import {
	checkForActiveWorkoutTimer,
	durationTo,
	getElapsedWorkoutTime,
} from "../utils/utils_workouts";
import { ETimerStatus } from "./usePersistentTimer";

/**
 * Hook to check for active/in-progress workout & display the elapsed time
 * - It's used within the WorkoutIsland indicator
 */

interface IElapsed {
	isActive: boolean;
	display: string;
	elapsed: number;
}

const useElapsedWorkoutTime = (
	cacheKey: string = "TIMER_KEY",
	intervalMs: number = 1000
) => {
	const [elapsed, setElapsed] = useState<IElapsed>({
		isActive: false,
		display: "00:00:00",
		elapsed: 0,
	});

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;
		const timer = checkForActiveWorkoutTimer();
		const isActive = timer?.status === ETimerStatus.ACTIVE;
		if (!isActive) {
			setElapsed({
				display: "00:00:00",
				elapsed: 0,
				isActive: false,
			});
			return;
		}

		const id = setInterval(() => {
			const { mins, secs } = getElapsedWorkoutTime(cacheKey);
			const validMins = isNaN(mins) ? 0 : mins;
			const validSecs = isNaN(secs) ? 0 : secs;
			const validElapsed = validMins + validSecs / 60;
			const validDisplay = durationTo(validElapsed, "HH:mm:ss");
			setElapsed({
				display: validDisplay,
				elapsed: validElapsed,
				isActive: true,
			});
		}, intervalMs);

		return () => {
			isMounted = false;
			clearInterval(id);
		};
	}, [cacheKey, intervalMs]);

	return elapsed;
};

export { useElapsedWorkoutTime };
