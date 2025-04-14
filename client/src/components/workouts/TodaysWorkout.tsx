import sprite from "../../assets/icons/main.svg";
import styles from "../../css/workouts/TodaysWorkout.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Activity } from "../../features/shared/types";
import { getActivityStyles } from "../../utils/utils_activity";
import { formatTime, parseAnyTime } from "../../utils/utils_dates";
import { TodaysWorkout as ITodaysWorkout } from "../../features/workouts/types";
import MenuDropdown from "../shared/MenuDropdown";
import ModalLG from "../shared/ModalLG";

type Props = {
	workout: ITodaysWorkout;
};

const getDuration = (duration: number) => {
	if (!duration || duration <= 0) return "Open";

	return duration + " min.";
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
		const tag = workout?.tagColor ?? "var(--blueGrey700)";
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
			<li onClick={() => onAction(EModalType.VIEW)}>View</li>
			<li onClick={() => onAction(EModalType.EDIT)}>Edit</li>
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
	const { workoutName, activityType, duration } = workout;
	const times = getWorkoutTimes(workout);
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [modalType, setModalType] = useState<ModalType | null>(null);
	const durationMins: string = getDuration(duration);
	const isCompleted: boolean = getIsCompleted(workout);
	const borderStyles = getBorderStyles(workout);

	const openMenu = () => setShowMenu(true);
	const closeMenu = () => setShowMenu(false);

	const goToStartWorkout = () => {
		const id = workout.workoutID;
		const type = workout.activityType;
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
					{/*  */}
					{/*  */}
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
					{/*  */}
					{/*  */}
				</ModalLG>
			)}
		</div>
	);
};

export default TodaysWorkout;
