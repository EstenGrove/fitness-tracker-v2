import { useMemo, useState } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/active-workout/WorkoutTimer.module.scss";
import {
	ETimerStatus,
	TimeInfo,
	TimerStatus,
	usePersistentTimer,
} from "../../hooks/usePersistentTimer";
import { formattedTime } from "../../utils/utils_formatter";
import {
	formatElapsedTime,
	getElapsedWorkoutTime,
} from "../../utils/utils_workouts";

type Props = {
	duration: number;
	onEnd: (info: TimeInfo) => void;
	onSkip: () => void;
	onReset?: () => void;
};

type ButtonProps = {
	onClick: () => void;
	isDisabled?: boolean;
};

type TimerControlProps = {
	status: TimerStatus;
	start: () => void;
	pause: () => void;
	resume: () => void;
	end: () => void;
	skip: () => void;
};

const TimerControls = ({
	status,
	start,
	pause,
	resume,
	end,
	skip,
}: TimerControlProps) => {
	const showStart =
		status === ETimerStatus.IDLE || status === ETimerStatus.PAUSED;
	const isPaused = status === ETimerStatus.PAUSED;
	const hasStarted =
		status === ETimerStatus.ACTIVE ||
		status === ETimerStatus.PAUSED ||
		status === ETimerStatus.STOPPED;

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
			<SkipButton onClick={skip} isDisabled={hasStarted} />
		</div>
	);
};

const StartButton = ({ onClick, isDisabled = false }: ButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			className={styles.StartButton}
		>
			<svg className={styles.StartButton_icon}>
				<use xlinkHref={`${sprite}#icon-play`}></use>
			</svg>
		</button>
	);
};
const PauseButton = ({ onClick, isDisabled = false }: ButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			className={styles.PauseButton}
		>
			<svg className={styles.PauseButton_icon}>
				<use xlinkHref={`${sprite}#icon-pause`}></use>
			</svg>
		</button>
	);
};
const EndWorkoutButton = ({ onClick, isDisabled = false }: ButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			className={styles.EndWorkoutButton}
		>
			<svg className={styles.EndWorkoutButton_icon}>
				<use xlinkHref={`${sprite}#icon-stop`}></use>
			</svg>
		</button>
	);
};
const SkipButton = ({ onClick, isDisabled = false }: ButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			className={styles.SkipButton}
		>
			<span>Skip</span>
		</button>
	);
};
const ResetButton = ({ onClick }: ButtonProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.ResetButton}>
			<svg className={styles.ResetButton_icon}>
				<use xlinkHref={`${sprite}#icon-time-machine`}></use>
			</svg>
			<span>Reset</span>
		</button>
	);
};

type DisplayProps = {
	status: TimerStatus;
	time: string;
};

const TimerDisplay = ({ status, time }: DisplayProps) => {
	const [elapsed, setElapsed] = useState({
		show: false,
		time: "0:00",
	});
	const isPaused = status === ETimerStatus.PAUSED;
	const css = {
		color:
			status === ETimerStatus.COUNTDOWN ? "var(--accent-blue)" : "var(--text1)",
	};

	const onClick = () => {
		const initial = getElapsedWorkoutTime();
		const newTime = formatElapsedTime(initial.mins, initial.secs);
		setElapsed({
			show: !elapsed.show,
			time: newTime,
		});
	};

	return (
		<div className={styles.TimerDisplay} onClick={onClick}>
			<div className={styles.TimerDisplay_time} style={css}>
				<div className={styles.TimerDisplay_time_elapsed}>
					{elapsed.show && `(elapsed ${elapsed.time})`}
				</div>
				{time}
				{isPaused && (
					<div className={styles.TimerDisplay_time_paused}>(Paused)</div>
				)}
			</div>
		</div>
	);
};

const WorkoutTimer = ({ duration, onEnd, onSkip, onReset }: Props) => {
	const timer = usePersistentTimer(duration, {
		onEnd(info) {
			return onEnd(info);
		},
	});
	const timerStatus: TimerStatus = timer.status;
	// Converts to seconds to '00:00' format
	const displayTime: string = useMemo(() => {
		const baseTime = Number(timer.timer.toFixed(0));
		return formattedTime(baseTime);
	}, [timer.timer]);

	const start = () => {
		timer.start();
	};
	const end = () => {
		timer.end();
	};
	const reset = () => {
		const statuses: TimerStatus[] = ["ACTIVE", "PAUSED"];
		if (statuses.includes(timerStatus)) {
			alert("Workout is IN-PROGRESS!");
			return;
		}
		timer.reset();

		return onReset && onReset();
	};
	const pause = () => {
		timer.pause();
	};
	const resume = () => {
		timer.resume();
	};
	const skip = () => {
		return onSkip && onSkip();
	};

	return (
		<div className={styles.WorkoutTimer}>
			<div className={styles.WorkoutTimer_display}>
				<TimerDisplay time={displayTime} status={timerStatus} />
			</div>
			<div className={styles.WorkoutTimer_controls}>
				<TimerControls
					status={timerStatus}
					start={start}
					pause={pause}
					resume={resume}
					end={end}
					skip={skip}
				/>
			</div>
			<div className={styles.WorkoutTimer_reset}>
				<ResetButton onClick={reset} />
			</div>
		</div>
	);
};

export default WorkoutTimer;
