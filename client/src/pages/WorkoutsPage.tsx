import sprite from "../assets/icons/main.svg";
import sprite2 from "../assets/icons/calendar.svg";
import sprite3 from "../assets/icons/dashboard.svg";
import styles from "../css/pages/WorkoutsPage.module.scss";
import { useAppDispatch } from "../store/store";
import { summaryApi } from "../features/dashboard/summaryApi";
import { sortByCompleted } from "../utils/utils_workouts";
import { useRef, useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { formatDate, formatDateTime } from "../utils/utils_dates";
import { useNavigate } from "react-router";
import { useTodaysWorkouts } from "../hooks/useTodaysWorkouts";
import { useAllWorkouts } from "../hooks/useAllWorkouts";
import { TodaysWorkout, Workout } from "../features/workouts/types";
import ModalLG from "../components/shared/ModalLG";
import TodaysWorkouts from "../components/workouts/TodaysWorkouts";
import CreateWorkout from "../components/workouts/CreateWorkout";
import LogWorkout from "../components/history/LogWorkout";
import PageHeader from "../components/layout/PageHeader";
import ScheduledWorkoutsCalendar from "../components/calendars/ScheduledWorkoutsCalendar";
import { useTodaysUnscheduledWorkouts } from "../hooks/useTodaysUnscheduledWorkouts";
import { TagDescription } from "@reduxjs/toolkit/query";
import SearchWorkouts from "../components/workouts/SearchWorkouts";
import StreaksStatusOverlay from "../components/streaks/StreaksStatusOverlay";
import { LocalStorage } from "../utils/utils_storage";
import { groupBy } from "../utils/utils_misc";
import CompletedTodayWorkouts from "../components/workouts/CompletedTodayWorkouts";

const storage = new LocalStorage();
const STREAKS_KEY = `STREAKS`;

type ActionBtnProps = {
	onClick: () => void;
};
type QuickAction = "CreateWorkout" | "LogWorkout";
type HeaderActionProps = {
	selectAction: (action: QuickAction) => void;
	onClose: () => void;
};
type ActionItemProps = {
	icon: string;
	label: string;
	onClick: () => void;
};
type PanelAction = "Goals" | "Calendar" | "Search" | "Trends";
type ActionsPanelProps = {
	onAction: (action: PanelAction) => void;
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

const cacheTags: TagDescription<"DashboardSummary">[] = [
	{ type: "DashboardSummary" },
];

const WorkoutsPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const targetDate = formatDate(new Date(), "db");
	const currentUser = useSelector(selectCurrentUser);
	const { data: workoutsList } = useAllWorkouts();
	const { data, isLoading } = useTodaysWorkouts(targetDate);
	const { data: completedToday, isLoading: loadingOthers } =
		useTodaysUnscheduledWorkouts(targetDate);

	console.log("[UN-SCHEDULED]:", groupBy("activityType", completedToday));

	const [panelAction, setPanelAction] = useState<PanelAction | null>(null);
	const [quickAction, setQuickAction] = useState<QuickAction | null>(null);
	const [showQuickActions, setShowQuickActions] = useState<boolean>(false);
	const [showAllWorkouts, setShowAllWorkouts] = useState<boolean>(false);
	const [showStreaksOverlay, setShowStreaksOverlay] = useState<boolean>(false);

	const list = data as TodaysWorkout[];
	const todaysWorkouts = sortByCompleted(list);
	const allWorkouts = workoutsList as Workout[];
	const hasUnscheduled = Boolean(completedToday?.length);

	const openQuickActions = () => setShowQuickActions(true);
	const closeQuickActions = () => setShowQuickActions(false);

	const invalidateCaches = () => {
		// Add more state Api's to invalidate, if needed
		dispatch(summaryApi.util.invalidateTags(cacheTags));
	};

	// [SPECIAL]: Closes quick action modal (eg. 'New' button)
	const closeQuickAction = () => {
		setQuickAction(null);
		invalidateCaches();
	};
	// the 'New' button (CreateWorkout | LogWorkout)
	const selectAction = (action: QuickAction) => {
		setQuickAction(action);
		closeQuickActions();
	};

	// circle buttons
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

	const onLoggedWorkout = () => {
		closeQuickAction();
		navigate("/history");
	};

	const onShowAllWorkouts = () => {
		setShowAllWorkouts(!showAllWorkouts);
	};

	const onDismissStreaks = () => {
		const timestamp = formatDateTime(new Date(), "longMs");
		storage.set(STREAKS_KEY, timestamp);
		setShowStreaksOverlay(false);
	};

	return (
		<div className={styles.WorkoutsPage}>
			<div className={styles.WorkoutsPage_header}>
				<PageHeader title="Workouts" styles={{ padding: "2rem 2.5rem" }}>
					<ActionButton onClick={openQuickActions} />

					{showQuickActions && (
						<HeaderActions
							selectAction={selectAction}
							onClose={closeQuickActions}
						/>
					)}
				</PageHeader>
			</div>
			<div className={styles.WorkoutsPage_main}>
				<div className={styles.WorkoutsPage_main_top}>
					<ActionsPanel onAction={selectPanelAction} />
				</div>
				<div className={styles.WorkoutsPage_main_list}>
					<TodaysWorkouts
						title="Today's Workouts"
						workouts={todaysWorkouts}
						unscheduled={completedToday}
						isLoading={isLoading}
						onShowAll={onShowAllWorkouts}
					/>

					{/* Shows other workouts completed today */}
					{hasUnscheduled && showAllWorkouts && (
						<CompletedTodayWorkouts
							title="Unscheduled"
							workouts={completedToday}
							isLoading={loadingOthers}
						/>
					)}
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
					<ScheduledWorkoutsCalendar />
				</ModalLG>
			)}
			{panelAction === "Search" && (
				<ModalLG onClose={closePanelActions}>
					<SearchWorkouts onClose={closePanelActions} />
				</ModalLG>
			)}

			{/* QUICK ACTIONS */}
			{quickAction === "CreateWorkout" && (
				<CreateWorkout onClose={closeQuickAction} currentUser={currentUser} />
			)}
			{quickAction === "LogWorkout" && (
				<LogWorkout
					currentUser={currentUser}
					onClose={closeQuickAction}
					onConfirm={onLoggedWorkout}
					allWorkouts={allWorkouts as Workout[]}
				/>
			)}

			{/* STREAKS OVERLAY */}
			{showStreaksOverlay && (
				<StreaksStatusOverlay date={targetDate} onDismiss={onDismissStreaks} />
			)}
		</div>
	);
};

export default WorkoutsPage;
