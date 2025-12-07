import sprite from "../../assets/icons/main.svg";
import styles from "../../css/workouts/TodaysWorkout.module.scss";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Activity } from "../../features/shared/types";
import { getActivityStyles } from "../../utils/utils_activity";
import {
	formatDate,
	formatTime,
	isMidnight,
	parseAnyTime,
} from "../../utils/utils_dates";
import { TodaysWorkout as ITodaysWorkout } from "../../features/workouts/types";
import { useAppDispatch } from "../../store/store";
import { setActiveWorkout } from "../../features/workouts/workoutsSlice";
import {
	MarkAsDoneValues,
	useDeleteWorkoutMutation,
	useMarkAsDoneMutation,
	useSkipWorkoutMutation,
} from "../../features/workouts/todaysWorkoutsApi";
import {
	MarkAsDoneBody,
	prepareMarkAsDoneBody,
	SkipWorkoutBody,
} from "../../utils/utils_workouts";
import { MarkAsDoneParams } from "../../features/types";
import { isValid } from "date-fns";
import MenuDropdown from "../shared/MenuDropdown";
import ViewWorkout from "./ViewWorkout";
import ModalLG from "../shared/ModalLG";
import MarkAsDone from "./MarkAsDone";
import ModalSM from "../shared/ModalSM";
import SkipWorkout from "./SkipWorkout";
import UnskipWorkout from "./UnskipWorkout";
import ViewPostWorkout from "../details/ViewPostWorkout";
import DeleteWorkout from "./DeleteWorkout";
import EditWorkout from "./EditWorkout";

type Props = {
	workout: ITodaysWorkout;
};

const getDurationDesc = (info: {
	duration: number;
	recorded: number | null;
}) => {
	const { duration, recorded } = info;
	const isOpen = Number(duration) === 0;
	const dur = Math.round(duration);
	const recordedDur = Math.round(recorded || 0);
	if (isOpen) {
		return "Open";
	}

	if (!recorded) {
		return dur + "min.";
	} else {
		return recordedDur + " of " + dur + "min.";
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
			return `${styles.TodaysWorkout} ${styles.isDone}`;
		}
		case wasSkipped: {
			return `${styles.TodaysWorkout} ${styles.isSkipped}`;
		}

		default: {
			return `${styles.TodaysWorkout} ${styles.notComplete}`;
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

type ModalType =
	| "VIEW"
	| "EDIT"
	| "DELETE"
	| "COMPLETE"
	| "CANCEL"
	| "SKIP"
	| "UNSKIP";

enum EModalType {
	VIEW = "VIEW",
	EDIT = "EDIT",
	DELETE = "DELETE",
	COMPLETE = "COMPLETE",
	CANCEL = "CANCEL",
	SKIP = "SKIP",
	UNSKIP = "UNSKIP",
}

type ItemsProps = {
	onAction: (action: ModalType) => void;
	isDone: boolean;
	wasSkipped: boolean;
};
const MenuItems = ({ onAction, isDone = false, wasSkipped }: ItemsProps) => {
	return (
		<>
			<li
				onClick={() => onAction(EModalType.VIEW)}
				style={{ color: "var(--todaysMenuText)" }}
			>
				View
			</li>
			<li
				onClick={() => onAction(EModalType.EDIT)}
				style={{ color: "var(--todaysMenuText)" }}
			>
				Edit
			</li>
			{wasSkipped ? (
				<li
					onClick={() => onAction(EModalType.SKIP)}
					style={{ color: "var(--accent-yellow)" }}
				>
					Un-skip Workout
				</li>
			) : (
				<li
					onClick={() => onAction(EModalType.SKIP)}
					style={{ color: "var(--accentRed)" }}
				>
					Skip Workout
				</li>
			)}

			{isDone ? (
				<li
					onClick={() => onAction(EModalType.CANCEL)}
					style={{ color: "var(--accent-yellow)" }}
				>
					Undo 'Done'
				</li>
			) : (
				<li onClick={() => onAction(EModalType.COMPLETE)}>Mark as Done</li>
			)}
			<li onClick={() => onAction(EModalType.DELETE)}>Delete</li>
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

const TodaysWorkout = ({ workout }: Props) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const triggerRef = useRef<HTMLDivElement>(null);
	const { workoutName, activityType, duration, recordedDuration } = workout;
	const [updateWorkout] = useMarkAsDoneMutation();
	const [skipWorkout] = useSkipWorkoutMutation();
	const [deleteWorkoutDate] = useDeleteWorkoutMutation();
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [modalType, setModalType] = useState<ModalType | null>(null);
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

	const onAction = (type: ModalType) => {
		setModalType(type);
		closeMenu();
	};
	const closeModal = () => {
		setModalType(null);
	};

	const confirmMarkAsDone = async (values: MarkAsDoneValues) => {
		const date = formatDate(values.workoutDate, "db");
		const altDate = formatDate(new Date(), "db");
		const workoutDate = isValid(date) ? date : altDate;
		const body: MarkAsDoneBody = {
			userID: workout.userID,
			workoutID: workout.workoutID,
			activityType: workout.activityType,
			startTime: values.startTime,
			endTime: values.endTime,
			workoutDate: workoutDate,
			effort: values.effort || "None",
			workoutLength: values.duration || workout.duration,
			sets: values.sets || [],
			steps: values.steps || 0,
			miles: values.miles || 0,
			pace: values.pace || 0,
			exercise: values.exercise || "",
		};
		const newBody = prepareMarkAsDoneBody(body.userID, body);
		const payload: MarkAsDoneParams = {
			userID: workout.userID,
			details: newBody,
		};
		await updateWorkout(payload);
		closeModal();
	};

	const onConfirmSkip = async () => {
		const { userID, workoutID, activityType } = workout;
		const date = formatDate(new Date(), "db");
		const body: SkipWorkoutBody = {
			userID: userID,
			workoutID: workoutID,
			workoutDate: date,
			activityType: activityType,
			reason: "Skipped for today only.",
		};

		await skipWorkout(body).unwrap();
		closeModal();
	};

	const confirmDeleteToday = async () => {
		const workoutDate = formatDate(new Date(), "db");
		const { userID, workoutID, activityType } = workout;
		await deleteWorkoutDate({
			userID,
			workoutID,
			activityType,
			workoutDate,
		});
		closeModal();
	};

	const cancelDeleteToday = () => {
		closeModal();
	};

	return (
		<div className={borderStyles}>
			<div className={styles.TodaysWorkout_top}>
				<div className={styles.TodaysWorkout_top_badge}>
					<TypeBadge activityType={activityType} />
				</div>
				<div className={styles.TodaysWorkout_top_title} onClick={goTo}>
					<h6>{workoutName}</h6>
					<div className={styles.TodaysWorkout_top_title_about}>{times}</div>
				</div>
				<div className={styles.TodaysWorkout_top_more} ref={triggerRef}>
					<svg
						onClick={openMenu}
						className={styles.TodaysWorkout_top_more_icon}
					>
						<use xlinkHref={`${sprite}#icon-dots-three-horizontal`}></use>
					</svg>
					{showMenu && (
						<MenuDropdown
							closeMenu={closeMenu}
							triggerRef={triggerRef}
							usePortal={true}
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
			<div className={styles.TodaysWorkout_bottom}>
				<div className={styles.TodaysWorkout_bottom_times}>
					<span>{durationMins}</span>
				</div>
				{hasUpdate ? (
					<StatusBadge workout={workout} onClick={goToStartWorkout} />
				) : (
					<StartButton onClick={goToStartWorkout} />
				)}
			</div>

			{modalType === EModalType.VIEW && (
				<ModalLG onClose={closeModal}>
					{isCompleted && <ViewPostWorkout workout={workout} />}
					{!isCompleted && (
						<ViewWorkout workout={workout} onClose={closeModal} />
					)}
				</ModalLG>
			)}
			{modalType === EModalType.SKIP && (
				<ModalSM onClose={closeModal}>
					<SkipWorkout onConfirm={onConfirmSkip} onCancel={closeModal} />
				</ModalSM>
			)}
			{modalType === EModalType.UNSKIP && (
				<ModalSM onClose={closeModal}>
					<UnskipWorkout onConfirm={onConfirmSkip} onCancel={closeModal} />
				</ModalSM>
			)}
			{modalType === EModalType.EDIT && (
				<ModalLG onClose={closeModal}>
					<EditWorkout workout={workout} onClose={closeModal} />
				</ModalLG>
			)}
			{modalType === EModalType.COMPLETE && (
				<ModalLG onClose={closeModal}>
					<MarkAsDone
						workout={workout}
						onClose={closeModal}
						onConfirm={confirmMarkAsDone}
					/>
				</ModalLG>
			)}

			{modalType === EModalType.DELETE && (
				<ModalSM onClose={closeModal}>
					<DeleteWorkout
						onCancel={cancelDeleteToday}
						onConfirm={confirmDeleteToday}
					/>
				</ModalSM>
			)}
		</div>
	);
};

export default TodaysWorkout;
