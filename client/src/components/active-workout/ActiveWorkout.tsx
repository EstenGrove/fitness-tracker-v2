import styles from "../../css/active-workout/ActiveWorkout.module.scss";
import { useState } from "react";
import { CurrentUser } from "../../features/user/types";
import { TodaysWorkout, Workout } from "../../features/workouts/types";
import { TimeInfo, TimerStatus } from "../../hooks/usePersistentTimer";
import EndedWorkout from "./EndedWorkout";
import WorkoutTimer from "./WorkoutTimer";
import { formattedTime } from "../../utils/utils_formatter";

type Props = {
	currentUser: CurrentUser;
	workout: TodaysWorkout | Workout;
};

// Calculates the seconds difference between timestamps
const calculateLengthInSecs = (info: TimeInfo) => {
	const { startedAt, endedAt, pausedAt, resumedAt } = info;
	const end = endedAt as number;
	const total = end - startedAt;
	// Was paused subtract from total time
	if (pausedAt && resumedAt) {
		const timeToRemove = resumedAt - pausedAt;
		const newTotal = total - timeToRemove;
		return newTotal / 1000;
	}

	return total / 1000;
};

const calculateLengthInFormat = (info: TimeInfo) => {
	const length = calculateLengthInSecs(info);
	const formatted = formattedTime(length);

	return {
		totalSecs: length,
		totalLength: formatted,
	};
};

interface TotalInfo {
	startedAt: number;
	startTime: string;
	status: TimerStatus;
	intervalInSecs: number;
	endedAt: number;
	endTime: string;
	pausedAt: number | null;
	pauseTime: string | null;
	resumedAt: number | null;
	resumeTime: string | null;
	totalSecs: number;
	totalLength: string;
}

const ActiveWorkout = ({ workout, currentUser }: Props) => {
	const [hasEnded, setHasEnded] = useState<boolean>(false);
	const [workoutInfo, setWorkoutInfo] = useState<TotalInfo | null>(null);

	const onEnd = (info: TimeInfo) => {
		const totals = calculateLengthInFormat(info);
		const newInfo = {
			...info,
			...totals,
		};

		setHasEnded(true);
		setWorkoutInfo(newInfo as TotalInfo);
	};

	const markWorkoutAsEnded = async () => {
		const { userID } = currentUser;
		console.log("userID", userID);
		// record it
	};

	return (
		<div className={styles.ActiveWorkout}>
			{!hasEnded && <WorkoutTimer duration={workout.duration} onEnd={onEnd} />}
			{hasEnded && <EndedWorkout info={workoutInfo as TotalInfo} />}
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default ActiveWorkout;
