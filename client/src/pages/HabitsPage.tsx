import styles from "../css/pages/HabitsPage.module.scss";
import sprite from "../assets/icons/main.svg";
import sprite2 from "../assets/icons/calendar.svg";
import { formatCustomDate, formatDate } from "../utils/utils_dates";
import { useHabitCards } from "../hooks/useHabitCards";
import { HabitCard, RecentHabitLog } from "../features/habits/types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { isEmptyArray } from "../utils/utils_misc";
import PageContainer from "../components/layout/PageContainer";
import HabitsList from "../components/habits/HabitsList";
import CreateHabit from "../components/habits/CreateHabit";
import Loader from "../components/layout/Loader";
import ModalLG from "../components/shared/ModalLG";
import { useRecentHabitLogs } from "../hooks/useRecentHabitLogs";
import RecentHabitLogs from "../components/habits/RecentHabitLogs";
import { NavLink } from "react-router";

const Header = ({ date, onCreate }: { date: string; onCreate: () => void }) => {
	return (
		<div className={styles.Header}>
			<div className={styles.Header_main}>
				<div className={styles.Header_main_date}>{date}</div>
				<h2 className={styles.Header_main_title}>Your Habits</h2>
			</div>
			<div className={styles.Header_create}>
				<button
					type="button"
					onClick={onCreate}
					className={styles.Header_create_new}
				>
					<svg className={styles.Header_create_new_icon}>
						<use xlinkHref={`${sprite}#icon-plus-math`}></use>
					</svg>
				</button>
			</div>
		</div>
	);
};

// Show habit logs for the last X days
const lastXDays = 3;

const HabitsPage = () => {
	const base = new Date();
	const baseDate = formatDate(base, "long");
	const currentUser = useSelector(selectCurrentUser);
	const targetDate = formatCustomDate(base, "monthAndDay");
	const { data, isLoading } = useHabitCards(baseDate);
	const { data: logs } = useRecentHabitLogs(baseDate, lastXDays);
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
	const [showReorderModal, setShowReorderModal] = useState<boolean>(false);
	const recentLogs = logs as RecentHabitLog[];
	const habits = data as HabitCard[];

	const openCreate = () => {
		setShowCreateModal(true);
	};
	const closeCreate = () => {
		setShowCreateModal(false);
	};
	const openReorder = () => {
		setShowReorderModal(true);
	};
	const closeReorder = () => {
		setShowReorderModal(false);
	};

	return (
		<PageContainer padding="2rem 1.5rem">
			<Header date={targetDate} onCreate={openCreate} />
			<div className={styles.HabitsPage}>
				<div className={styles.HabitsPage_details}>
					<div className={styles.HabitsPage_details_count}>
						Habits: {habits?.length ?? 0}
					</div>
					<div
						className={styles.HabitsPage_details_reorder}
						onClick={openReorder}
					>
						<svg className={styles.HabitsPage_details_reorder_icon}>
							<use xlinkHref={`${sprite2}#icon-drag_indicator`}></use>
						</svg>
						<span>Reorder</span>
					</div>
				</div>
				<div className={styles.HabitsPage_list}>
					{isLoading && (
						<Loader>
							<span>Loading habits...</span>
						</Loader>
					)}
					{!isLoading && !isEmptyArray(habits) && (
						<HabitsList habits={habits} />
					)}
				</div>
				<div className={styles.HabitsPage_recents}>
					<div className={styles.HabitsPage_recents_heading}>
						<div className={styles.HabitsPage_recents_heading_title}>
							Recent Logs (last {lastXDays} days)
						</div>
						<NavLink
							to="/habits/recents"
							className={styles.HabitsPage_recents_heading_more}
						>
							Show All
						</NavLink>
					</div>
					{!isEmptyArray(recentLogs) && (
						<RecentHabitLogs recentLogs={recentLogs} />
					)}
				</div>

				{/* CREATE HABIT */}
				{showCreateModal && (
					<CreateHabit onClose={closeCreate} currentUser={currentUser} />
				)}

				{/* REORDER HABITS */}
				{showReorderModal && (
					<ModalLG onClose={closeReorder}>
						{/*  */}
						{/*  */}
					</ModalLG>
				)}
			</div>
		</PageContainer>
	);
};

export default HabitsPage;
