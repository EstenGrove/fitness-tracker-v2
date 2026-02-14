import { useState, useMemo } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/layout/WorkoutIsland.module.scss";
import { EActiveStatus } from "../../hooks/useWorkoutTimer";
import { ActiveWorkoutInfo, durationTo } from "../../utils/utils_workouts";
import { Activity } from "../../features/shared/types";
import { getActivityStyles } from "../../utils/utils_activity";
import { addEllipsis } from "../../utils/utils_misc";
import { useWorkoutTimerContext } from "../../context/useWorkoutContext";
import { ETimerStatus, TimerStatus } from "../../hooks/usePersistentTimer";

type Props = {
	workout: ActiveWorkoutInfo;
	onResume: () => void;
	onPause: () => void;
	onDismiss: () => void;
};

const PlayIcon = ({ onClick }: { onClick: () => void }) => {
	return (
		<div className={styles.PlayIcon} onClick={onClick}>
			<svg className={styles.PlayIcon_icon}>
				<use xlinkHref={`${sprite}#icon-play`}></use>
			</svg>
		</div>
	);
};
const PauseIcon = ({ onClick }: { onClick: () => void }) => {
	return (
		<div className={styles.PauseIcon} onClick={onClick}>
			<svg className={styles.PauseIcon_icon}>
				<use xlinkHref={`${sprite}#icon-pause`}></use>
			</svg>
		</div>
	);
};

const ResumeButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<div className={styles.ResumeButton} onClick={onClick}>
			{/* <svg className={styles.ResumeButton_icon}>
				<use xlinkHref={`${sprite}#icon-arrow-right`}></use>
      </svg> */}
			<span>View</span>
		</div>
	);
};

const DismissButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<div className={styles.DismissButton} onClick={onClick}>
			<span>Dismiss</span>
		</div>
	);
};

const DismissIcon = ({ onClick }: { onClick: () => void }) => {
	return (
		<div className={styles.DismissIcon} onClick={onClick}>
			<svg className={styles.DismissIcon_icon}>
				<use xlinkHref={`${sprite}#icon-in-progress`}></use>
			</svg>
		</div>
	);
};

const ActivityIcon = ({ activityType }: { activityType: Activity }) => {
	const { color, bg } = getActivityStyles(activityType);
	const icons = {
		Walk: "walking-2",
		Strength: "dumbbell-2",
		Stretch: "stretching-2",
		Cardio: "heart-with-pulse",
		Timed: "timer",
		Other: "exercise",
	};
	return (
		<div className={styles.ActivityIcon} style={{ backgroundColor: bg }}>
			<svg className={styles.ActivityIcon_icon} style={{ fill: color }}>
				<use xlinkHref={`${sprite}#icon-${icons[activityType]}`}></use>
			</svg>
		</div>
	);
};

type ExpandedSectionProps = {
	workout: ActiveWorkoutInfo;
	onResume: () => void;
	onPause: () => void;
	onDismiss: () => void;
	toggleExpanded: () => void;
	isVisible: boolean;
};

const getStatusInfo = (status: TimerStatus) => {
	switch (status) {
		case ETimerStatus.ACTIVE:
			return { label: "Active", className: styles.status_active };
		case ETimerStatus.PAUSED:
			return { label: "Paused", className: styles.status_paused };
		case ETimerStatus.IDLE:
			return { label: "Ready", className: styles.status_idle };
		case ETimerStatus.STOPPED:
			return { label: "Stopped", className: styles.status_stopped };
		case ETimerStatus.ENDED:
			return { label: "Ended", className: styles.status_ended };
		default:
			return { label: "", className: "" };
	}
};

const ExpandedSection = ({
	workout,
	onResume,
	onPause,
	onDismiss,
	toggleExpanded,
	isVisible,
}: ExpandedSectionProps) => {
	const { workoutName, activityType, duration } = workout;
	const title = addEllipsis(workoutName, 15);
	// Use the shared timer context directly
	const { timer, status, pause, resume, start } = useWorkoutTimerContext();

	// Format the timer display from context
	const display = useMemo(() => {
		const elapsedMins = timer / 60;
		return durationTo(elapsedMins, "HH:mm:ss");
	}, [timer]);

	const handlePause = () => {
		pause(); // Pause the shared timer
		onPause(); // Parent callback (for navigation, etc.)
	};

	// Play icon - starts/resumes timer but does NOT navigate
	const handlePlay = () => {
		// If timer is IDLE, start it; otherwise resume
		if (status === ETimerStatus.IDLE) {
			start(duration);
		} else {
			resume();
		}
		// No navigation - just start/resume the timer
	};

	// Resume button - navigates to active workout page
	const handleResume = () => {
		// We ONLY want to navigate to the active workout page
		onResume(); // Navigate
	};

	const isTimerActive = status === ETimerStatus.ACTIVE;

	const statusInfo = getStatusInfo(status);

	return (
		<div
			className={`${styles.ExpandedSection} ${
				isVisible ? styles.ExpandedSection_visible : ""
			}`}
		>
			<div className={styles.ExpandedSection_top} onClick={toggleExpanded}>
				<ActivityIcon activityType={activityType} />
				<div className={styles.ExpandedSection_top_title}>{title}</div>
			</div>
			<div className={styles.ExpandedSection_body}>
				<div className={styles.ExpandedSection_body_elapsed}>
					{display}
					{statusInfo.label && (
						<span
							className={`${styles.status_indicator} ${statusInfo.className}`}
						>
							{statusInfo.label}
						</span>
					)}
				</div>
			</div>
			<div className={styles.ExpandedSection_actions}>
				<DismissButton onClick={onDismiss} />
				<div className={styles.ExpandedSection_actions_right}>
					{isTimerActive ? (
						<PauseIcon onClick={handlePause} />
					) : (
						<PlayIcon onClick={handlePlay} />
					)}
					<DismissIcon onClick={onDismiss} />
					<ResumeButton onClick={handleResume} />
				</div>
			</div>
		</div>
	);
};

type CollapsedSectionProps = {
	workout: ActiveWorkoutInfo;
	onResume: () => void;
	onPause: () => void;
	onDismiss: () => void;
	toggleExpanded: () => void;
	isVisible: boolean;
};

const CollapsedSection = ({
	workout,
	onResume,
	onDismiss,
	toggleExpanded,
	isVisible,
}: Omit<CollapsedSectionProps, "onPause">) => {
	const { status, workoutName, activityType } = workout;
	const title = addEllipsis(workoutName, 15);
	return (
		<div
			className={`${styles.CollapsedSection} ${
				isVisible ? styles.CollapsedSection_visible : ""
			}`}
			onClick={toggleExpanded}
		>
			<div className={styles.CollapsedSection_left}>
				<ActivityIcon activityType={activityType} />
				<div className={styles.CollapsedSection_left_title}>{title}</div>
			</div>
			<div className={styles.CollapsedSection_right}>
				{status === EActiveStatus.ACTIVE ? (
					<>{/* <PauseIcon onClick={onPause} /> */}</>
				) : (
					<PlayIcon onClick={onResume} />
				)}
				{/* <ResumeIcon onClick={onResume} /> */}
				<DismissIcon onClick={onDismiss} />
			</div>
		</div>
	);
};

const WorkoutIsland = ({ workout, onResume, onPause, onDismiss }: Props) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div
			className={`${styles.WorkoutIsland} ${
				isExpanded ? styles.WorkoutIsland_expanded : ""
			}`}
		>
			<div className={`${styles.WorkoutIsland_content}`}>
				<CollapsedSection
					workout={workout}
					onResume={onResume}
					onDismiss={onDismiss}
					toggleExpanded={toggleExpanded}
					isVisible={!isExpanded}
				/>
				<ExpandedSection
					workout={workout}
					onResume={onResume}
					onPause={onPause}
					onDismiss={onDismiss}
					toggleExpanded={toggleExpanded}
					isVisible={isExpanded}
				/>
			</div>
		</div>
	);
};

export default WorkoutIsland;
