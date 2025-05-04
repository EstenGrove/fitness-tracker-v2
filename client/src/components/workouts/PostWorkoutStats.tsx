import styles from "../../css/workouts/PostWorkoutStats.module.scss";
import { TodaysWorkout } from "../../features/workouts/types";

type Props = {
	workout: TodaysWorkout;
};

const PostWorkoutStats = ({ workout }: Props) => {
	const statsSummary = {
		workoutID: workout.workoutID,
	};

	console.log("statsSummary", statsSummary);
	return (
		<div className={styles.PostWorkoutStats}>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default PostWorkoutStats;
