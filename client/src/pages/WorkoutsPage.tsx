import { format } from "date-fns";
import sprite from "../assets/icons/main.svg";
import sprite2 from "../assets/icons/calendar.svg";
import sprite3 from "../assets/icons/dashboard.svg";
import styles from "../css/pages/WorkoutsPage.module.scss";
import { ReactNode, useRef, useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { formatDate } from "../utils/utils_dates";
import { useNavigate } from "react-router";
import { useTodaysWorkouts } from "../hooks/useTodaysWorkouts";
import { useSkippedWorkouts } from "../hooks/useSkippedWorkouts";
import { useAllWorkouts } from "../hooks/useAllWorkouts";
import { TodaysWorkout, Workout } from "../features/workouts/types";
import ModalLG from "../components/shared/ModalLG";
import TodaysWorkouts from "../components/workouts/TodaysWorkouts";
import CreateWorkout from "../components/workouts/CreateWorkout";
import LogWorkout from "../components/history/LogWorkout";

const getTodaysDate = (date?: Date | string) => {
	if (!date) {
		const now = new Date();
		const today = format(now, "EEE, MMM do");

		return today;
	} else {
		const today = format(date, "EEE, MMM do");
		return today;
	}
};

type ActionBtnProps = {
	onClick: () => void;
};

const SearchButton = ({ onClick }: ActionBtnProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.SearchButton}>
			<svg className={styles.SearchButton_icon}>
				<use xlinkHref={`${sprite2}#icon-search`}></use>
			</svg>
		</button>
	);
};
const CalendarButton = ({ onClick }: ActionBtnProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.CalendarButton}>
			<svg className={styles.CalendarButton_icon}>
				<use xlinkHref={`${sprite2}#icon-calendar_today`}></use>
			</svg>
		</button>
	);
};
const GoalsButton = ({ onClick }: ActionBtnProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.GoalsButton}>
			<svg className={styles.GoalsButton_icon}>
				<use xlinkHref={`${sprite}#icon-goal`}></use>
			</svg>
		</button>
	);
};
const TrendsButton = ({ onClick }: ActionBtnProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.TrendsButton}>
			<svg className={styles.TrendsButton_icon}>
				<use xlinkHref={`${sprite}#icon-positive-dynamic`}></use>
			</svg>
		</button>
	);
};

type PanelAction = "Goals" | "Calendar" | "Search" | "Trends";
type ActionsPanelProps = {
	onAction: (action: PanelAction) => void;
};

const ActionsPanel = ({ onAction }: ActionsPanelProps) => {
	return (
		<div className={styles.ActionsPanel}>
			<GoalsButton onClick={() => onAction("Goals")} />
			<CalendarButton onClick={() => onAction("Calendar")} />
			<TrendsButton onClick={() => onAction("Trends")} />
			<SearchButton onClick={() => onAction("Search")} />
		</div>
	);
};

type ActionItemProps = {
	icon: string;
	label: string;
	onClick: () => void;
};

const ActionItem = ({ icon, onClick, label }: ActionItemProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.ActionItem}>
			<svg className={styles.ActionItem_icon}>
				<use xlinkHref={`${sprite2}#icon-${icon}`}></use>
			</svg>
			<div className={styles.ActionItem_label}>{label}</div>
		</button>
	);
};

const ActionButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.ActionButton}>
			<svg className={styles.ActionButton_icon}>
				<use xlinkHref={`${sprite3}#icon-auto_fix_high`}></use>
			</svg>
			<span> New</span>
		</button>
	);
};
type QuickAction = "CreateWorkout" | "LogWorkout";
type HeaderActionProps = {
	selectAction: (action: QuickAction) => void;
	onClose: () => void;
};

const HeaderActions = ({ selectAction, onClose }: HeaderActionProps) => {
	const headerRef = useRef<HTMLDivElement>(null);
	useOutsideClick(headerRef, onClose);
	return (
		<div ref={headerRef} className={styles.HeaderActions}>
			<div className={styles.HeaderActions_item}>
				<ActionItem
					key="Create Workout"
					icon="add_task"
					label="Create Workout"
					onClick={() => selectAction("CreateWorkout")}
				/>
			</div>
			<div className={styles.HeaderActions_item}>
				<ActionItem
					key="Log Workout"
					icon="add_task"
					label="Log Workout"
					onClick={() => selectAction("LogWorkout")}
				/>
			</div>
		</div>
	);
};

const WorkoutHeader = ({
	title,
	children,
}: {
	title: string;
	children?: ReactNode;
}) => {
	const today = getTodaysDate();
	return (
		<div className={styles.WorkoutHeader}>
			<div className={styles.WorkoutHeader_main}>
				<div className={styles.WorkoutHeader_main_today}>{today}</div>
				<h2 className={styles.WorkoutHeader_main_label}>{title}</h2>
			</div>
			<div className={styles.WorkoutHeader_actions}>{children}</div>
		</div>
	);
};

const sortByCompleted = (workouts: TodaysWorkout[]) => {
	if (!workouts || !workouts.length) return [];

	const isDone = (workout: TodaysWorkout) => {
		const status = workout.workoutStatus;

		switch (status) {
			case "COMPLETE":
				return 1;
			case "IN-PROGRESS":
				return 1.5;
			case "NOT-COMPLETE":
				return 0;
			case "SKIPPED":
				return 2;

			default:
				return 0;
		}
	};

	return [...workouts]?.sort((a, b) => {
		return isDone(a) - isDone(b);
	});
};

const WorkoutsPage = () => {
	const navigate = useNavigate();
	const targetDate = formatDate(new Date(), "db");
	const currentUser = useSelector(selectCurrentUser);
	const { data: workoutsList } = useAllWorkouts();
	const { data, isLoading } = useTodaysWorkouts(targetDate);
	const { data: skipList } = useSkippedWorkouts(targetDate);

	const [panelAction, setPanelAction] = useState<PanelAction | null>(null);
	const [quickAction, setQuickAction] = useState<QuickAction | null>(null);
	const [showQuickActions, setShowQuickActions] = useState<boolean>(false);

	const list = data as TodaysWorkout[];
	const skipped = skipList as TodaysWorkout[];
	const todaysWorkouts = sortByCompleted(list);
	const allWorkouts = workoutsList as Workout[];

	const openQuickActions = () => setShowQuickActions(true);
	const closeQuickActions = () => setShowQuickActions(false);

	// Closes quick action modal
	const closeQuickAction = () => {
		setQuickAction(null);
	};

	const selectAction = (action: QuickAction) => {
		setQuickAction(action);
		closeQuickActions();
	};

	const selectPanelAction = (action: PanelAction) => {
		if (action === "Trends") {
			navigate("/trends");
		} else {
			setPanelAction(action);
		}
	};
	const closePanelActions = () => {
		setPanelAction(null);
	};

	return (
		<div className={styles.WorkoutsPage}>
			<div className={styles.WorkoutsPage_header}>
				<WorkoutHeader title="Workouts">
					<ActionButton onClick={openQuickActions} />

					{showQuickActions && (
						<HeaderActions
							selectAction={selectAction}
							onClose={closeQuickActions}
						/>
					)}
				</WorkoutHeader>
			</div>
			<div className={styles.WorkoutsPage_main}>
				<div className={styles.WorkoutsPage_main_top}>
					<ActionsPanel onAction={selectPanelAction} />
				</div>
				<div className={styles.WorkoutsPage_main_list}>
					<TodaysWorkouts
						workouts={todaysWorkouts}
						skipped={skipped}
						isLoading={isLoading}
					/>
				</div>
			</div>

			{/* PANEL ACTION BUTTONS */}
			{panelAction === "Goals" && (
				<ModalLG onClose={closePanelActions}>
					<div>Goals</div>
				</ModalLG>
			)}
			{panelAction === "Calendar" && (
				<ModalLG onClose={closePanelActions}>
					<div>Calendar</div>
				</ModalLG>
			)}
			{panelAction === "Search" && (
				<ModalLG onClose={closePanelActions}>
					<div>Search</div>
				</ModalLG>
			)}

			{/* QUICK ACTIONS */}
			{quickAction === "CreateWorkout" && (
				<CreateWorkout onClose={closeQuickAction} />
			)}
			{quickAction === "LogWorkout" && (
				<LogWorkout
					currentUser={currentUser}
					onClose={closeQuickAction}
					allWorkouts={allWorkouts as Workout[]}
				/>
			)}
		</div>
	);
};

export default WorkoutsPage;
