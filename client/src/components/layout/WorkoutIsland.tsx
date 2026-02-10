import { useState } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/layout/WorkoutIsland.module.scss";
import { EActiveStatus } from "../../hooks/useWorkoutTimer";
import { ActiveWorkoutInfo } from "../../utils/utils_workouts";
import { Activity } from "../../features/shared/types";
import { getActivityStyles } from "../../utils/utils_activity";
import { addEllipsis } from "../../utils/utils_misc";

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

const ResumeIcon = ({ onClick }: { onClick: () => void }) => {
	return (
		<div className={styles.ResumeIcon} onClick={onClick}>
			<svg className={styles.ResumeIcon_icon}>
				<use xlinkHref={`${sprite}#icon-arrow-right`}></use>
			</svg>
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

const ExpandedSection = ({
	workout,
	onResume,
	onPause,
	onDismiss,
	toggleExpanded,
	isVisible,
}: ExpandedSectionProps) => {
	const { workoutName, activityType } = workout;
	const title = addEllipsis(workoutName, 15);
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
				{/*  */}
				{/*  */}
			</div>
			<div className={styles.ExpandedSection_actions}>
				<PlayIcon onClick={onResume} />
				<PauseIcon onClick={onPause} />
				<DismissIcon onClick={onDismiss} />
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
	onPause,
	onDismiss,
	toggleExpanded,
	isVisible,
}: CollapsedSectionProps) => {
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
					onPause={onPause}
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
