import sprite from "../../assets/icons/main.svg";
import styles from "../../css/workouts/UserWorkout.module.scss";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Activity } from "../../features/shared/types";
import { getActivityStyles } from "../../utils/utils_activity";
import { formatTime, isMidnight, parseAnyTime } from "../../utils/utils_dates";
import { TodaysWorkout as ITodaysWorkout } from "../../features/workouts/types";
import { useAppDispatch } from "../../store/store";
import {
	setActiveWorkout,
	setWorkoutDetails,
} from "../../features/workouts/workoutsSlice";
import MenuDropdown from "../shared/MenuDropdown";

type Props = {
	workout: ITodaysWorkout;
};

const getDurationDesc = (info: {
	duration: number;
	recorded: number | null;
}) => {
	const { duration, recorded } = info;
	const isOpen = Number(duration) === 0;
	if (isOpen) {
		return "Open";
	}

	if (!recorded) {
		return duration + "min.";
	} else {
		return recorded + " of " + duration + "min.";
	}
};

const getIsCompleted = (workout: ITodaysWorkout) => {
	const status = workout.workoutStatus;

	return status === "COMPLETE";
};

const isSkipped = (workout: ITodaysWorkout) => {
	const status = workout.workoutStatus;
	return status === "SKIPPED";
};

const getBorderStyles = (workout: ITodaysWorkout) => {
	const isDone = getIsCompleted(workout);
	const wasSkipped = isSkipped(workout);

	switch (true) {
		case isDone: {
			return `${styles.UserWorkout} ${styles.isDone}`;
		}
		case wasSkipped: {
			return `${styles.UserWorkout} ${styles.isSkipped}`;
		}

		default: {
			return `${styles.UserWorkout} ${styles.notComplete}`;
		}
	}
};

const getWorkoutTimes = (workout: ITodaysWorkout) => {
	const { startTime, endTime } = workout;

	// check for midnight
	if (isMidnight(startTime) || isMidnight(endTime)) {
		return "Any time";
	}

	if (!startTime || !endTime) return "";
	const startP = parseAnyTime(startTime);
	const endP = parseAnyTime(endTime);
	const start = formatTime(startP, "long");
	const end = formatTime(endP, "long");

	return `${start} to ${end}`;
};

type ActionType =
	| "VIEW"
	| "EDIT"
	| "DELETE"
	| "COMPLETE"
	| "CANCEL"
	| "SKIP"
	| "UNSKIP";

enum EActionType {
	VIEW = "VIEW",
	EDIT = "EDIT",
	DELETE = "DELETE",
	COMPLETE = "COMPLETE",
	CANCEL = "CANCEL",
	SKIP = "SKIP",
	UNSKIP = "UNSKIP",
}

type ItemsProps = {
	onAction: (action: ActionType) => void;
	isDone: boolean;
	wasSkipped: boolean;
};
const MenuItems = ({ onAction, isDone = false, wasSkipped }: ItemsProps) => {
	return (
		<>
			<li
				onClick={() => onAction(EActionType.VIEW)}
				style={{ color: "var(--todaysMenuText)" }}
			>
				View
			</li>
			<li
				onClick={() => onAction(EActionType.EDIT)}
				style={{ color: "var(--todaysMenuText)" }}
			>
				Edit
			</li>
			{wasSkipped ? (
				<li
					onClick={() => onAction(EActionType.SKIP)}
					style={{ color: "var(--accent-yellow)" }}
				>
					Un-skip Workout
				</li>
			) : (
				<li
					onClick={() => onAction(EActionType.SKIP)}
					style={{ color: "var(--accentRed)" }}
				>
					Skip Workout
				</li>
			)}

			{isDone ? (
				<li
					onClick={() => onAction(EActionType.CANCEL)}
					style={{ color: "var(--accent-yellow)" }}
				>
					Undo 'Done'
				</li>
			) : (
				<li onClick={() => onAction(EActionType.COMPLETE)}>Mark as Done</li>
			)}
			<li onClick={() => onAction(EActionType.DELETE)}>Delete</li>
		</>
	);
};

const TypeBadge = ({ activityType }: { activityType: Activity }) => {
	const { icon, color, bg } = getActivityStyles(activityType);
	const iconCSS = { fill: color };
	const bgCSS = { backgroundColor: bg };
	return (
		<div className={styles.TypeBadge} style={bgCSS}>
			<svg className={styles.TypeBadge_icon} style={iconCSS}>
				<use xlinkHref={`${sprite}#icon-${icon}`} />
			</svg>
		</div>
	);
};

const StartButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.StartButton}>
			<svg className={styles.StartButton_icon}>
				<use xlinkHref={`${sprite}#icon-play`}></use>
			</svg>
		</button>
	);
};
const CompletedBadge = ({ onClick }: { onClick?: () => void }) => {
	return (
		<div className={styles.CompletedBadge} onClick={onClick}>
			Done
		</div>
	);
};
const SkippedBadge = ({ onClick }: { onClick?: () => void }) => {
	return (
		<div className={styles.SkippedBadge} onClick={onClick}>
			Skipped
		</div>
	);
};
const StatusBadge = ({
	workout,
	onClick,
}: {
	workout: ITodaysWorkout;
	onClick: () => void;
}) => {
	const status = workout.workoutStatus;

	const badges = {
		COMPLETE: <CompletedBadge />,
		SKIPPED: <SkippedBadge />,
		// SKIPPED: <StartButton onClick={onClick} />,
		"NOT-COMPLETE": <StartButton onClick={onClick} />,
	};
	const badge = badges[status as keyof object];

	return <>{badge}</>;
};

const hasStatus = (workout: ITodaysWorkout) => {
	const status = workout.workoutStatus;
	const hasUpdate = ["COMPLETE", "SKIPPED"].includes(status);
	const hasMins = !!workout.recordedDuration;
	return hasMins || hasUpdate;
};

const UserWorkout = ({ workout }: Props) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const triggerRef = useRef<HTMLDivElement>(null);
	const { workoutName, activityType, duration, recordedDuration } = workout;
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const borderStyles = getBorderStyles(workout);
	const hasUpdate: boolean = hasStatus(workout);
	const wasSkipped: boolean = isSkipped(workout);
	const isCompleted: boolean = getIsCompleted(workout);
	const times = getWorkoutTimes(workout);
	const durationMins: string = getDurationDesc({
		duration: duration,
		recorded: recordedDuration,
	});

	const openMenu = () => setShowMenu(true);
	const closeMenu = () => setShowMenu(false);

	const goToStartWorkout = () => {
		const id = workout.workoutID;
		const type = workout.activityType;
		dispatch(setActiveWorkout(workout));
		navigate(`/active/${id}?type=${type}`);
	};

	const goTo = () => {
		const id = workout.workoutID;
		navigate(id);
	};

	const onAction = (action: ActionType) => {
		console.log("[ACTION]", action);
		const id = workout.workoutID;
		const type = workout.activityType;
		dispatch(setWorkoutDetails({ workout }));

		switch (action) {
			case EActionType.VIEW: {
				navigate(`/workouts/details/${id}?type=${type}`);
				closeMenu();
				return;
			}
			case EActionType.EDIT: {
				navigate(`/workouts/details/${id}?type=${type}`);
				closeMenu();
				return;
			}
			case EActionType.DELETE: {
				return;
			}
			default:
				break;
		}
	};

	return (
		<div className={borderStyles}>
			<div className={styles.UserWorkout_top}>
				<div className={styles.UserWorkout_top_badge}>
					<TypeBadge activityType={activityType} />
				</div>
				<div className={styles.UserWorkout_top_title} onClick={goTo}>
					<h6>{workoutName}</h6>
					<div className={styles.UserWorkout_top_title_about}>{times}</div>
				</div>
				<div className={styles.UserWorkout_top_more} ref={triggerRef}>
					<svg onClick={openMenu} className={styles.UserWorkout_top_more_icon}>
						<use xlinkHref={`${sprite}#icon-dots-three-horizontal`}></use>
					</svg>
					{showMenu && (
						<MenuDropdown
							closeMenu={closeMenu}
							triggerRef={triggerRef}
							usePortal={false}
						>
							<MenuItems
								isDone={isCompleted}
								onAction={onAction}
								wasSkipped={wasSkipped}
							/>
						</MenuDropdown>
					)}
				</div>
			</div>
			<div className={styles.UserWorkout_bottom}>
				<div className={styles.UserWorkout_bottom_times}>
					<span>{durationMins}</span>
				</div>
				{hasUpdate ? (
					<StatusBadge workout={workout} onClick={goToStartWorkout} />
				) : (
					<StartButton onClick={goToStartWorkout} />
				)}
			</div>
		</div>
	);
};

export default UserWorkout;
