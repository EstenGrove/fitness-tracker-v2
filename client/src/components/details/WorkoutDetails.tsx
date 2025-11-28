import styles from "../../css/details/WorkoutDetails.module.scss";
import sprite from "../../assets/icons/main.svg";
import { WorkoutByType, WorkoutSchedule } from "../../features/workouts/types";
import { HistoryOfType } from "../../features/history/types";

import { formatDuration as formatDurationDF } from "date-fns";

type Props = {
	workout: WorkoutByType;
	schedule: WorkoutSchedule;
	history: HistoryOfType[];
};

const formatDur = (dur: number) => {
	const time = formatDurationDF({
		minutes: dur,
	});

	return time;
};

const WorkoutDetails = ({ workout }: Props) => {
	const duration = formatDur(workout.duration);
	return (
		<div className={styles.WorkoutDetails}>
			<div className={styles.WorkoutDetails_duration}>
				<svg className={styles.WorkoutDetails_duration_icon}>
					<use xlinkHref={`${sprite}#icon-time`}></use>
				</svg>
				<span>{duration}</span>
			</div>
		</div>
	);
};

export default WorkoutDetails;
