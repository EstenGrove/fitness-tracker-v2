import { useState } from "react";
import sprite from "../../assets/icons/habits.svg";
import sprite2 from "../../assets/icons/main.svg";
import styles from "../../css/dashboard/DashboardHabits.module.scss";
import { HabitCard } from "../../features/habits/types";
import {
	EHabitModalType,
	habitIcons,
	HabitModalType,
} from "../../utils/utils_habits";
import { addEllipsis, isEmptyArray } from "../../utils/utils_misc";
import NoData from "../ui/NoData";
import NumberCounter from "../ui/NumberCounter";
import MenuDropdown from "../shared/MenuDropdown";
import ModalSM from "../shared/ModalSM";
import DeleteHabit from "../habits/DeleteHabit";
import ChangeHabitGoal from "../habits/ChangeHabitGoal";
import ModalWithFooter from "../shared/ModalWithFooter";
import ModalLG from "../shared/ModalLG";
import QuickLogHabit from "../habits/QuickLogHabit";
import { useAppDispatch } from "../../store/store";
import { summaryApi } from "../../features/dashboard/summaryApi";
import { useNavigate } from "react-router";

type Props = {
	habits: HabitCard[];
};

type TotalProps = {
	loggedValue: number;
	targetValue: number;
	unit: string;
};

type FooterProps = {
	onCancel: () => void;
	onSave: () => void;
};
const Footer = ({ onCancel, onSave }: FooterProps) => {
	return (
		<div className={styles.Footer}>
			<button type="button" onClick={onCancel} className={styles.Footer_cancel}>
				Cancel
			</button>
			<button type="button" onClick={onSave} className={styles.Footer_save}>
				Update
			</button>
		</div>
	);
};

const Total = ({ loggedValue = 0, targetValue = 0, unit }: TotalProps) => {
	const habitUnit = addEllipsis(unit, 10);
	return (
		<div className={styles.Total}>
			<span className={styles.Total_logged}>
				<NumberCounter number={loggedValue} duration={650} />
			</span>
			<span className={styles.Total_slash}>/</span>
			<span className={styles.Total_target}>
				{targetValue} {habitUnit}
			</span>
		</div>
	);
};

type HeaderProps = {
	icon: string;
	color: string;
	name: string;
	goTo: () => void;
	onAction: (action: HabitModalType) => void;
};

const HabitHeader = ({
	icon,
	name,
	color = "var(--text1_5",
	goTo,
	onAction,
}: HeaderProps) => {
	const css = { fill: color };
	const habitName = addEllipsis(name, 18);
	const [showMore, setShowMore] = useState<boolean>(false);

	const openMore = () => setShowMore(true);
	const closeMore = () => setShowMore(false);

	const handleAction = (type: HabitModalType) => {
		onAction(type);
		closeMore();
	};

	return (
		<div className={styles.HabitHeader}>
			<svg className={styles.HabitHeader_icon} style={css} onClick={goTo}>
				<use xlinkHref={`${sprite}#icon-${icon}`}></use>
			</svg>
			<h3 className={styles.HabitHeader_title} onClick={goTo}>
				{habitName}
			</h3>
			<svg className={styles.HabitHeader_more} onClick={openMore}>
				<use xlinkHref={`${sprite2}#icon-dots-three-vertical`}></use>
			</svg>

			{showMore && (
				<MenuDropdown closeMenu={closeMore}>
					<li
						className={styles.MenuItem}
						onClick={() => handleAction(EHabitModalType.EDIT)}
					>
						View
					</li>
					<li
						className={styles.MenuItem}
						onClick={() => handleAction(EHabitModalType.EDIT)}
					>
						Change Goal
					</li>
					<li
						className={styles.MenuItem}
						onClick={() => handleAction(EHabitModalType.DELETE)}
					>
						Delete
					</li>
				</MenuDropdown>
			)}
		</div>
	);
};

type DashboardHabitProps = {
	habit: HabitCard;
	onAction: (action: HabitModalType, entry: HabitCard) => void;
	onAddLog: () => void;
};

const QuickLogButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button onClick={onClick} className={styles.QuickLogButton}>
			Add Log
		</button>
	);
};

const DashboardHabit = ({ habit, onAction, onAddLog }: DashboardHabitProps) => {
	const navigate = useNavigate();
	const { habitName, icon, iconColor, habitsLogged } = habit;
	const iconName = habitIcons[icon];
	const logged = habitsLogged;
	const goal = habit.habitTarget;
	const unit = habit.habitUnit;

	const handleAction = (action: HabitModalType) => {
		return onAction && onAction(action, habit);
	};

	const handleGoTo = () => {
		const id = habit.habitID;
		const path = `/habits/${id}/tracker`;
		navigate(path);
	};

	return (
		<div className={styles.DashboardHabit}>
			<div className={styles.DashboardHabit_top}>
				<HabitHeader
					icon={iconName}
					name={habitName}
					color={iconColor}
					goTo={handleGoTo}
					onAction={handleAction}
				/>
			</div>
			<div className={styles.DashboardHabit_main}>
				<Total unit={unit} targetValue={goal} loggedValue={logged} />
			</div>
			<div className={styles.DashboardHabit_bottom}>
				<QuickLogButton onClick={onAddLog} />
			</div>
		</div>
	);
};

const DashboardHabits = ({ habits }: Props) => {
	const dispatch = useAppDispatch();
	const hasHabits = !isEmptyArray(habits);
	const [modalType, setModalType] = useState<HabitModalType | null>(null);
	const [selectedHabit, setSelectedHabit] = useState<HabitCard | null>(null);

	const selectHabit = (action: HabitModalType, habit: HabitCard) => {
		setSelectedHabit(habit);
		setModalType(action);
	};
	const closeModal = () => {
		setModalType(null);
		setSelectedHabit(null);
		invalidateCache();
	};

	const openQuickLog = (habit: HabitCard) => {
		setModalType(EHabitModalType.LOG);
		setSelectedHabit(habit);
	};

	const confirmDelete = async () => {
		//  do stuff
	};
	const confirmGoalChanges = async () => {
		// do stuff
	};

	const invalidateCache = () => {
		dispatch(summaryApi.util.invalidateTags([{ type: "DashboardSummary" }]));
	};

	return (
		<div className={styles.DashboardHabits}>
			<div className={styles.DashboardHabits_list}>
				{!hasHabits && <NoData icon="empty" msg="No habits found." />}
				{hasHabits &&
					habits.map((habit, idx) => {
						const key = `${habit.habitID}-${idx}`;
						return (
							<DashboardHabit
								key={key}
								habit={habit}
								onAction={selectHabit}
								onAddLog={() => openQuickLog(habit)}
							/>
						);
					})}
			</div>

			{/* QUICK LOG HABIT */}
			{modalType === EHabitModalType.LOG && selectedHabit && (
				<ModalLG onClose={closeModal}>
					<QuickLogHabit habit={selectedHabit} />
				</ModalLG>
			)}

			{/* VIEW HABIT DETAILS */}
			{modalType === EHabitModalType.VIEW && selectedHabit && (
				<ModalLG onClose={closeModal}>
					{/*  */}
					{/*  */}
				</ModalLG>
			)}
			{/* CHANGE GOAL */}
			{modalType === EHabitModalType.EDIT && selectedHabit && (
				<ModalWithFooter
					onClose={closeModal}
					size="SM"
					footer={<Footer onCancel={closeModal} onSave={confirmGoalChanges} />}
				>
					<ChangeHabitGoal habit={selectedHabit} />
				</ModalWithFooter>
			)}
			{/* DELETE HABIT */}
			{modalType === EHabitModalType.DELETE && selectedHabit && (
				<ModalSM onClose={closeModal}>
					<DeleteHabit onCancel={closeModal} onConfirm={confirmDelete} />
				</ModalSM>
			)}
		</div>
	);
};

export default DashboardHabits;
