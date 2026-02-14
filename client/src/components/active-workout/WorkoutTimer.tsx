import { useEffect, useMemo, useState } from "react";
import { useWorkoutContext } from "../../context/useWorkoutContext";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/active-workout/WorkoutTimer.module.scss";
import {
	ETimerStatus,
	getPersistedInfo,
	TimeInfo,
	TimerStatus,
} from "../../hooks/usePersistentTimer";
import { formattedTime } from "../../utils/utils_formatter";
import {
	formatElapsedTime,
	getElapsedWorkoutTime,
} from "../../utils/utils_workouts";
import { formatDateTime } from "../../utils/utils_dates";

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

const getNows = () => {
	const timestamp = Date.now();
	const timeStr = formatDateTime(new Date(), "longMs");

	return {
		startTime: timeStr, // 4533515
		startedAt: timestamp, // 2025-05-10 07:39:42
	};
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
	const { workoutTimer: timer, setDuration } = useWorkoutContext();
	const timerStatus: TimerStatus = timer.status;
	// Converts to seconds to '00:00' format
	const displayTime: string = useMemo(() => {
		// Since we have to sync the duration from here to the context timer, the 'workoutTimer.timer' is not actually populated until we start the timer
		const initialDur: number = timer.duration * 60;
		const currentTimer: number = Number(timer.timer.toFixed(0));
		const isIdle: boolean = timer.status === ETimerStatus.IDLE;
		const time: number = isIdle ? initialDur : currentTimer;
		return formattedTime(time);
	}, [timer.duration, timer.status, timer.timer]);

	const start = () => {
		timer.start();
	};
	const end = () => {
		const info = getPersistedInfo() as TimeInfo;
		const { startedAt, startTime } = getNows();
		const newInfo: TimeInfo = {
			...info,
			endedAt: startedAt,
			endTime: startTime,
		};
		timer.end(newInfo);
		return onEnd && onEnd(newInfo);
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

	// We need to sync the initial duration from props to our context timer
	useEffect(() => {
		setDuration(duration);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
