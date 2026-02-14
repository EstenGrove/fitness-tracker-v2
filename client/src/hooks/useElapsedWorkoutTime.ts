import { useEffect, useState } from "react";
import { durationTo } from "../utils/utils_workouts";
import { ETimerStatus } from "./usePersistentTimer";
import { useWorkoutTimerContext } from "../context/useWorkoutContext";

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
	// Use context directly - this is the source of truth
	const { timer: timerSeconds, status } = useWorkoutTimerContext();

	const [elapsed, setElapsed] = useState<IElapsed>({
		isActive: false,
		display: "00:00:00",
		elapsed: 0,
	});

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		const id = setInterval(() => {
			// Use context timer directly - it's always in sync
			const isActive = status === ETimerStatus.ACTIVE;
			const elapsedMins = timerSeconds / 60;
			const display = durationTo(elapsedMins, "HH:mm:ss");

			setElapsed({
				display,
				elapsed: elapsedMins,
				isActive,
			});
		}, intervalMs);

		return () => {
			isMounted = false;
			clearInterval(id);
		};
	}, [cacheKey, intervalMs, timerSeconds, status]);

	return elapsed;
};

export { useElapsedWorkoutTime };
