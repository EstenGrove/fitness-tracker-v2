import styles from "../../css/workouts/MarkAsDone.module.scss";
import { TodaysWorkout } from "../../features/workouts/types";
import TimePicker from "../shared/TimePicker";

type Props = {
	workout: TodaysWorkout;
};

// REQUIREMENTS:
// - Start Time
// - Duration
// - Sets (cardio, strength)

const MarkAsDone = ({ workout }: Props) => {
	return (
		<div className={styles.MarkAsDone}>
			<div className={styles.MarkAsDone_header}>
				<h2>Mark as Done</h2>
			</div>
			<div className={styles.MarkAsDone_start}>
				<label htmlFor="startTime">Started at:</label>
				<TimePicker />
			</div>
			<div className={styles.MarkAsDone_start}>
				<label htmlFor="duration">Workout Length:</label>
				{/* <TimePicker /> */}
			</div>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default MarkAsDone;
