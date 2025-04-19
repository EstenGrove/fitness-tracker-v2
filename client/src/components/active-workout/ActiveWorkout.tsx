import styles from "../../css/active-workout/ActiveWorkout.module.scss";
import { useState } from "react";
import { CurrentUser } from "../../features/user/types";
import { TodaysWorkout, Workout } from "../../features/workouts/types";
import WorkoutTimer from "./WorkoutTimer";
import { TimeInfoAndTotal } from "../../hooks/useWorkoutTimer";
import EndedWorkout from "./EndedWorkout";

type Props = {
	currentUser: CurrentUser;
	workout: TodaysWorkout | Workout;
};

const ActiveWorkout = ({ workout, currentUser }: Props) => {
	const [hasEnded, setHasEnded] = useState<boolean>(false);
	const [workoutInfo, setWorkoutInfo] = useState<TimeInfoAndTotal>({
		startedAt: null,
		pausedAt: null,
		resumedAt: null,
		endedAt: null,
		totalTime: null,
	});

	const onEnd = (info: TimeInfoAndTotal) => {
		console.log("info", info);
		setHasEnded(true);
		setWorkoutInfo(info);
	};

	return (
		<div className={styles.ActiveWorkout}>
			{!hasEnded && <WorkoutTimer duration={workout.duration} onEnd={onEnd} />}
			{hasEnded && <EndedWorkout info={workoutInfo} />}
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default ActiveWorkout;
