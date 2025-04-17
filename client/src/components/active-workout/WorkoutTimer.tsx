import sprite from "../../assets/icons/main.svg";
import styles from "../../css/active-workout/WorkoutTimer.module.scss";
import {
	EActiveStatus,
	TimeInfoAndTotal,
	useWorkoutTimer,
} from "../../hooks/useWorkoutTimer";
import { useCountdown } from "../../hooks/useCountdown";

type Props = {
	duration: number;
	onEnd: (info: TimeInfoAndTotal) => void;
};

type ButtonProps = {
	onClick: () => void;
};

const StartButton = ({ onClick }: ButtonProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.StartButton}>
			<svg className={styles.StartButton_icon}>
				<use xlinkHref={`${sprite}#icon-play`}></use>
			</svg>
		</button>
	);
};
const PauseButton = ({ onClick }: ButtonProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.PauseButton}>
			<svg className={styles.PauseButton_icon}>
				<use xlinkHref={`${sprite}#icon-pause`}></use>
			</svg>
		</button>
	);
};
const EndWorkoutButton = ({ onClick }: ButtonProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.EndWorkoutButton}>
			<svg className={styles.EndWorkoutButton_icon}>
				<use xlinkHref={`${sprite}#icon-stop`}></use>
			</svg>
		</button>
	);
};
const SkipButton = ({ onClick }: ButtonProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.SkipButton}>
			<span>Skip</span>
		</button>
	);
};

type TimerControlProps = {
	status: ActiveStatus;
	start: () => void;
	pause: () => void;
	resume: () => void;
	end: () => void;
};

const TimerControls = ({
	status,
	start,
	pause,
	resume,
	end,
}: TimerControlProps) => {
	const showStart = status === "IDLE" || status === "PAUSED";
	const isPaused = status === "PAUSED";

	const startOrResume = () => {
		return isPaused ? resume() : start();
	};

	return (
		<div className={styles.TimerControls}>
			<EndWorkoutButton onClick={end} />
			{showStart ? (
				<StartButton onClick={startOrResume} />
			) : (
				<PauseButton onClick={pause} />
			)}
			<SkipButton />
		</div>
	);
};

type DisplayProps = {
	status: ActiveStatus;
	time: string;
};

const TimerDisplay = ({ status, time }: DisplayProps) => {
	console.log("status", status);
	const css = {
		color:
			status === EActiveStatus.COUNTING ? "var(--accent-blue)" : "var(--text1)",
	};
	return (
		<div className={styles.TimerDisplay}>
			<div className={styles.TimerDisplay_time} style={css}>
				{time}
			</div>
		</div>
	);
};

type ActiveStatus = "ACTIVE" | "PAUSED" | "ENDED" | "IDLE" | "COUNTING";

const formatDuration = (duration: number) => {
	return duration + ":00";
};

const WorkoutTimer = ({ duration, onEnd }: Props) => {
	const length = formatDuration(duration);
	const timer = useWorkoutTimer({
		onEnd(info) {
			return onEnd(info);
		},
	});
	const countdown = useCountdown(3, () => {
		start();
	});
	const { status, info, time } = timer;
	const { count, isActive } = countdown;
	const activeStatus = isActive ? EActiveStatus.COUNTING : status;
	const timeDisplay = (
		isActive ? count : status === EActiveStatus.IDLE ? length : time
	) as string;

	const startCountdown = () => {
		countdown.start();
	};

	const start = () => {
		timer.start();
	};
	const pause = () => {
		timer.pause();
	};
	const resume = () => {
		timer.resume();
	};
	const end = () => {
		timer.end();
		const totalTime = timer.time;

		return onEnd && onEnd({ ...info, totalTime });
	};

	return (
		<div className={styles.WorkoutTimer}>
			<div className={styles.WorkoutTimer_display}>
				<TimerDisplay time={timeDisplay} status={activeStatus} />
			</div>
			<div className={styles.WorkoutTimer_controls}>
				<TimerControls
					status={activeStatus}
					start={startCountdown}
					pause={pause}
					resume={resume}
					end={end}
				/>
			</div>
		</div>
	);
};

export default WorkoutTimer;
