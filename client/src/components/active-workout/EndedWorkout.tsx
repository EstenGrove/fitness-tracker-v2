import sprite from "../../assets/icons/main.svg";
import styles from "../../css/active-workout/EndedWorkout.module.scss";
import { TimeInfoAndTotal } from "../../hooks/useWorkoutTimer";
import { formatTime } from "../../utils/utils_dates";

type Props = {
	info: TimeInfoAndTotal;
};

const EndedWorkout = ({ info }: Props) => {
	const { startedAt, endedAt, totalTime } = info;
	const start = formatTime(startedAt as string, "longMs");
	const end = formatTime(endedAt as string, "longMs");

	console.log("info(EndedWorkout):", info);
	return (
		<div className={styles.EndedWorkout}>
			<div className={styles.EndedWorkout_wrapper}>
				<svg className={styles.EndedWorkout_wrapper_icon}>
					<use xlinkHref={`${sprite}#icon-guarantee`}></use>
				</svg>
				<div className={styles.EndedWorkout_wrapper_title}>
					Workout Has Ended!
				</div>
			</div>
			<div className={styles.EndedWorkout_about}>
				<div>
					Length: <b>{totalTime}</b>
				</div>
				<div>
					Started at: <b>{start}</b>
				</div>
				<div>
					Ended at: <b>{end}</b>
				</div>
			</div>
		</div>
	);
};

export default EndedWorkout;
