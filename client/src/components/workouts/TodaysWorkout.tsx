import sprite from "../../assets/icons/main.svg";
import styles from "../../css/workouts/TodaysWorkout.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Activity } from "../../features/shared/types";
import { getActivityStyles } from "../../utils/utils_activity";
import { formatDate, formatTime, parseAnyTime } from "../../utils/utils_dates";
import { TodaysWorkout as ITodaysWorkout } from "../../features/workouts/types";
import { useAppDispatch } from "../../store/store";
import { setActiveWorkout } from "../../features/workouts/workoutsSlice";
import {
	MarkAsDoneValues,
	useMarkAsDoneMutation,
} from "../../features/workouts/todaysWorkoutsApi";
import {
	MarkAsDoneBody,
	prepareMarkAsDoneBody,
} from "../../utils/utils_workouts";
import { MarkAsDoneParams } from "../../features/types";
import { isValid } from "date-fns";
import MenuDropdown from "../shared/MenuDropdown";
import ViewWorkout from "./ViewWorkout";
import ModalLG from "../shared/ModalLG";
import MarkAsDone from "./MarkAsDone";

type Props = {
	workout: ITodaysWorkout;
};

const getDurationDesc = (info: {
	duration: number;
	recorded: number | null;
}) => {
	const { duration, recorded } = info;
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

const getBorderStyles = (workout: ITodaysWorkout) => {
	const isDone = getIsCompleted(workout);

	if (isDone) {
		return {
			borderLeft: `5px solid rgba(0, 226, 189, 1)`,
		};
	} else {
		const tag = workout?.tagColor ?? "var(--todaysBorder)";
		return {
			borderLeft: `5px solid ${tag}`,
		};
	}
};

const getWorkoutTimes = (workout: ITodaysWorkout) => {
	const { startTime, endTime } = workout;

	if (!startTime || !endTime) return "";
	const startP = parseAnyTime(startTime);
	const endP = parseAnyTime(endTime);
	const start = formatTime(startP, "long");
	const end = formatTime(endP, "long");

	return `${start} to ${end}`;
};

type ModalType = "VIEW" | "EDIT" | "DELETE" | "COMPLETE" | "CANCEL";

enum EModalType {
	VIEW = "VIEW",
	EDIT = "EDIT",
	DELETE = "DELETE",
	COMPLETE = "COMPLETE",
	CANCEL = "CANCEL",
}

type ItemsProps = {
	onAction: (action: ModalType) => void;
	isDone: boolean;
};
const MenuItems = ({ onAction, isDone = false }: ItemsProps) => {
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

const IsCompleted = () => {
	return <div className={styles.IsCompleted}>Done</div>;
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

const TodaysWorkout = ({ workout }: Props) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { workoutName, activityType, duration, recordedDuration } = workout;
	const [updateWorkout] = useMarkAsDoneMutation();
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [modalType, setModalType] = useState<ModalType | null>(null);
	const isCompleted: boolean = getIsCompleted(workout);
	const borderStyles = getBorderStyles(workout);
	const times = getWorkoutTimes(workout);
	const durationMins: string = getDurationDesc({
		duration,
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

	return (
		<div className={styles.TodaysWorkout} style={borderStyles}>
			<div className={styles.TodaysWorkout_top}>
				<div className={styles.TodaysWorkout_top_badge}>
					<TypeBadge activityType={activityType} />
				</div>
				<div className={styles.TodaysWorkout_top_title} onClick={goTo}>
					<h6>{workoutName}</h6>
					<div className={styles.TodaysWorkout_top_title_about}>{times}</div>
				</div>
				<div className={styles.TodaysWorkout_top_more}>
					<svg
						onClick={openMenu}
						className={styles.TodaysWorkout_top_more_icon}
					>
						<use xlinkHref={`${sprite}#icon-dots-three-horizontal`}></use>
					</svg>
					{showMenu && (
						<MenuDropdown closeMenu={closeMenu}>
							<MenuItems isDone={isCompleted} onAction={onAction} />
						</MenuDropdown>
					)}
				</div>
			</div>
			<div className={styles.TodaysWorkout_bottom}>
				<div className={styles.TodaysWorkout_bottom_times}>
					<span>{durationMins}</span>
				</div>
				{isCompleted ? (
					<IsCompleted />
				) : (
					<StartButton onClick={goToStartWorkout} />
				)}
			</div>

			{modalType === EModalType.VIEW && (
				<ModalLG onClose={closeModal}>
					<ViewWorkout workout={workout} onClose={closeModal} />
				</ModalLG>
			)}
			{modalType === EModalType.EDIT && (
				<ModalLG onClose={closeModal}>
					{/*  */}
					{/*  */}
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
		</div>
	);
};

export default TodaysWorkout;
