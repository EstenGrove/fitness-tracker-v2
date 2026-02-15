import { useState } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/layout/WorkoutIsland.module.scss";
import { ActiveWorkoutInfo } from "../../utils/utils_workouts";
import { Activity } from "../../features/shared/types";
import { getActivityStyles } from "../../utils/utils_activity";
import { addEllipsis } from "../../utils/utils_misc";
import { useWorkoutContext } from "../../context/useWorkoutContext";
import { formattedTime } from "../../utils/utils_formatter";
import { TimerStatus, ETimerStatus } from "../../hooks/usePersistentTimer";

type Props = {
	workout: ActiveWorkoutInfo;
	onResume: () => void;
	onPause: () => void;
	onDismiss: () => void;
	onViewWorkout: () => void;
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

const ViewButton = ({
	onClick,
	isCollapsed = true,
}: {
	onClick: () => void;
	isCollapsed: boolean;
}) => {
	const css = {
		borderRadius: isCollapsed ? "5rem" : "1rem",
	};
	return (
		<div className={styles.ResumeButton} onClick={onClick} style={css}>
			<span>View</span>
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

const DismissButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button
			type="button"
			className={styles.DismissButton}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			Dismiss
		</button>
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

const StatusBadge = ({ status }: { status: TimerStatus }) => {
	const getStatusLabel = (status: TimerStatus): string => {
		switch (status) {
			case ETimerStatus.ACTIVE:
				return "Active";
			case ETimerStatus.PAUSED:
				return "Paused";
			case ETimerStatus.IDLE:
				return "Idle";
			case ETimerStatus.STOPPED:
				return "Stopped";
			case ETimerStatus.ENDED:
				return "Ended";
			case ETimerStatus.COUNTDOWN:
				return "Countdown";
			default:
				return "Unknown";
		}
	};

	const getStatusClass = (status: TimerStatus): string => {
		switch (status) {
			case ETimerStatus.ACTIVE:
				return styles.StatusBadge_active;
			case ETimerStatus.PAUSED:
				return styles.StatusBadge_paused;
			case ETimerStatus.IDLE:
				return styles.StatusBadge_idle;
			case ETimerStatus.STOPPED:
				return styles.StatusBadge_stopped;
			case ETimerStatus.ENDED:
				return styles.StatusBadge_ended;
			case ETimerStatus.COUNTDOWN:
				return styles.StatusBadge_countdown;
			default:
				return styles.StatusBadge_idle;
		}
	};

	return (
		<div className={`${styles.StatusBadge} ${getStatusClass(status)}`}>
			{getStatusLabel(status)}
		</div>
	);
};

// ============================================
// STATUS DOT - Easy to delete if not needed
// ============================================
const StatusDot = ({ status }: { status: TimerStatus }) => {
	const getStatusClass = (status: TimerStatus): string => {
		switch (status) {
			case ETimerStatus.ACTIVE:
				return styles.StatusDot_active;
			case ETimerStatus.PAUSED:
				return styles.StatusDot_paused;
			case ETimerStatus.IDLE:
				return styles.StatusDot_idle;
			case ETimerStatus.STOPPED:
				return styles.StatusDot_stopped;
			case ETimerStatus.ENDED:
				return styles.StatusDot_ended;
			case ETimerStatus.COUNTDOWN:
				return styles.StatusDot_countdown;
			default:
				return styles.StatusDot_idle;
		}
	};

	return <div className={`${styles.StatusDot} ${getStatusClass(status)}`} />;
};

type ExpandedSectionProps = {
	workout: ActiveWorkoutInfo;
	onResume: () => void;
	onPause: () => void;
	onDismiss: () => void;
	onView: () => void;
	toggleExpanded: () => void;
	isVisible: boolean;
	status: TimerStatus;
	timer: number;
};

const ExpandedSection = ({
	workout,
	onResume,
	onPause,
	onDismiss,
	onView,
	toggleExpanded,
	isVisible,
	status,
	timer,
}: ExpandedSectionProps) => {
	const { workoutName, activityType } = workout;
	const title = addEllipsis(workoutName, 28);
	const display: string = formattedTime(Number(timer.toFixed(0)));
	const isActive: boolean = status === ETimerStatus.ACTIVE;

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
				<div className={styles.ExpandedSection_body_content}>
					<div className={styles.ExpandedSection_body_elapsed}>{display}</div>
					<StatusBadge status={status} />
				</div>
			</div>
			<div className={styles.ExpandedSection_actions}>
				{isActive ? (
					<PauseIcon onClick={onPause} />
				) : (
					<PlayIcon onClick={onResume} />
				)}
				<DismissIcon onClick={onDismiss} />
				<ViewButton onClick={onView} isCollapsed={false} />
			</div>
			<DismissButton onClick={onDismiss} />
		</div>
	);
};

type CollapsedSectionProps = {
	workout: ActiveWorkoutInfo;
	onView: () => void;
	onPause: () => void;
	onResume: () => void;
	toggleExpanded: () => void;
	isVisible: boolean;
	status: TimerStatus;
};

const CollapsedSection = ({
	workout,
	status,
	onResume,
	onPause,
	onView,
	toggleExpanded,
	isVisible,
}: CollapsedSectionProps) => {
	const { workoutName, activityType } = workout;
	const title = addEllipsis(workoutName, 15);
	const isActive: boolean = status === ETimerStatus.ACTIVE;
	return (
		<div
			className={`${styles.CollapsedSection} ${
				isVisible ? styles.CollapsedSection_visible : ""
			}`}
			onClick={toggleExpanded}
		>
			<div className={styles.CollapsedSection_left}>
				<ActivityIcon activityType={activityType} />
				{/* STATUS DOT - Delete this line and the StatusDot component above if not needed */}
				<StatusDot status={status} />
				<div className={styles.CollapsedSection_left_title}>{title}</div>
			</div>
			<div className={styles.CollapsedSection_right}>
				{isActive ? (
					<PauseIcon onClick={onPause} />
				) : (
					<PlayIcon onClick={onResume} />
				)}
				<ViewButton onClick={onView} isCollapsed={true} />
			</div>
		</div>
	);
};

const WorkoutIsland = ({
	workout,
	onPause,
	onDismiss,
	onViewWorkout,
}: Props) => {
	const { workoutTimer: timer } = useWorkoutContext();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	const handlePause = () => {
		timer.pause();
		onPause();
	};

	const handleResume = () => {
		timer.resume();
	};

	const handleViewWorkout = () => {
		onViewWorkout();
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
					onResume={handleResume}
					onView={handleViewWorkout}
					onPause={handlePause}
					toggleExpanded={toggleExpanded}
					isVisible={!isExpanded}
					status={timer.status}
				/>
				<ExpandedSection
					workout={workout}
					onResume={handleResume}
					onPause={handlePause}
					onDismiss={onDismiss}
					onView={handleViewWorkout}
					toggleExpanded={toggleExpanded}
					isVisible={isExpanded}
					status={timer.status}
					timer={timer.timer}
				/>
			</div>
		</div>
	);
};

export default WorkoutIsland;
