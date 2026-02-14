import { useMemo, useState, useEffect } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/active-workout/WorkoutTimer.module.scss";
import {
	ETimerStatus,
	TimeInfo,
	TimerStatus,
} from "../../hooks/usePersistentTimer";
import { formattedTime } from "../../utils/utils_formatter";
import {
	formatElapsedTime,
	getElapsedWorkoutTime,
} from "../../utils/utils_workouts";
import { useWorkoutTimerContext } from "../../context/useWorkoutContext";

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
	// Use the shared timer instance from context
	const { timer, status, timeInfo, start, pause, resume, end, reset } =
		useWorkoutTimerContext();

	// Initialize timer with workout duration when component mounts (but don't start it)
	// This ensures the timer displays the correct duration (e.g., 15:00) even when IDLE
	useEffect(() => {
		// Only initialize if timer is IDLE and there's no existing timer in localStorage
		if (status === ETimerStatus.IDLE && !timeInfo) {
			// Reset to set the correct duration without starting
			reset(duration);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only on mount

	const timerStatus: TimerStatus = status;
	// Converts to seconds to '00:00' format
	const displayTime: string = useMemo(() => {
		const baseTime = Number(timer.toFixed(0));
		return formattedTime(baseTime);
	}, [timer]);

	const handleStart = () => {
		start(duration);
	};

	const handleEnd = () => {
		end();
		// timeInfo will be updated by the context's onEnd callback
		// We'll handle the onEnd call in a useEffect to ensure we have the latest timeInfo
	};

	// Watch for when timer ends and timeInfo is available
	useEffect(() => {
		// When timer ends (status becomes IDLE) and we have timeInfo with endedAt, call onEnd
		if (status === "IDLE" && timeInfo && timeInfo.endedAt) {
			onEnd(timeInfo);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, timeInfo]);

	const handleReset = () => {
		const statuses: TimerStatus[] = ["ACTIVE", "PAUSED"];
		if (statuses.includes(timerStatus)) {
			alert("Workout is IN-PROGRESS!");
			return;
		}
		reset(duration);

		return onReset && onReset();
	};

	const handlePause = () => {
		pause();
	};

	const handleResume = () => {
		resume();
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
					start={handleStart}
					pause={handlePause}
					resume={handleResume}
					end={handleEnd}
					skip={skip}
				/>
			</div>
			<div className={styles.WorkoutTimer_reset}>
				<ResetButton onClick={handleReset} />
			</div>
		</div>
	);
};

export default WorkoutTimer;
