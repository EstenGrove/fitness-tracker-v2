import sprite from "../../assets/icons/main.svg";
import styles from "../../css/active-workout/EndedWorkout.module.scss";
import { TimerStatus } from "../../hooks/usePersistentTimer";
import { formatTimestamp } from "../../utils/utils_dates";

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

type Props = {
	info: TotalInfo;
	onAddDetails: () => void;
};

const normalizeLength = (length: string) => {
	const [start, secs] = length.split(".");
	const newSecs = secs.slice(0, 3);
	return `${start}:${newSecs}`;
};

const EndedWorkout = ({ info, onAddDetails }: Props) => {
	const { startedAt, endedAt, totalSecs, totalLength } = info;
	const length = normalizeLength(totalLength);
	const start = formatTimestamp(startedAt, "longMs");
	const end = formatTimestamp(endedAt, "longMs");

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
					Length:{" "}
					<b>
						{length} ({totalSecs}s)
					</b>
				</div>
				<div>
					Started at: <b>{start}</b>
				</div>
				<div>
					Ended at: <b>{end}</b>
				</div>
			</div>
			<div className={styles.EndedWorkout_actions}>
				<button
					type="button"
					onClick={onAddDetails}
					className={styles.EndedWorkout_actions_add}
				>
					<svg className={styles.EndedWorkout_actions_add_icon}>
						<use xlinkHref={`${sprite}#icon-edit-property`}></use>
					</svg>
					<span>Add Details</span>
				</button>
			</div>
		</div>
	);
};

export default EndedWorkout;
