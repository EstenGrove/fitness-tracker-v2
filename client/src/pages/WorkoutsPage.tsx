import { format } from "date-fns";
import sprite from "../assets/icons/main.svg";
import sprite2 from "../assets/icons/calendar.svg";
import sprite3 from "../assets/icons/dashboard.svg";
import styles from "../css/pages/WorkoutsPage.module.scss";
import { ReactNode, RefObject, useRef, useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import ModalLG from "../components/shared/ModalLG";

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

type PanelAction = "Goals" | "Calendar" | "Search";
type ActionsPanelProps = {
	onAction: (action: PanelAction) => void;
};

const ActionsPanel = ({ onAction }: ActionsPanelProps) => {
	return (
		<div className={styles.ActionsPanel}>
			<GoalsButton onClick={() => onAction("Goals")} />
			<CalendarButton onClick={() => onAction("Calendar")} />
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
	useOutsideClick(headerRef as RefObject<HTMLDivElement>, onClose);
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

const WorkoutsPage = () => {
	const [panelAction, setPanelAction] = useState<PanelAction | null>(null);
	const [quickAction, setQuickAction] = useState<QuickAction | null>(null);
	const [showQuickActions, setShowQuickActions] = useState<boolean>(false);

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
		setPanelAction(action);
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
					{/* TODAYS WORKOUTS */}
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
				<ModalLG onClose={closeQuickAction}>
					<div>Create Workout</div>
				</ModalLG>
			)}
			{quickAction === "LogWorkout" && (
				<ModalLG onClose={closeQuickAction}>
					<div>Log Workout</div>
				</ModalLG>
			)}
		</div>
	);
};

export default WorkoutsPage;
