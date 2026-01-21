import sprite from "../../assets/icons/main.svg";
import sprite2 from "../../assets/icons/dashboard.svg";
import styles from "../../css/layout/TopNav.module.scss";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { LocalStorage } from "../../utils/utils_storage";
import { NavLink } from "react-router";
import WeeklyRecap from "../weekly-recap/WeeklyRecap";
import { subDays } from "date-fns";
import { formatDate } from "../../utils/utils_dates";

const THEME_KEY = "APP_THEME";
const storage = new LocalStorage();

const toggleTheme = () => {
	const cacheTheme = storage.get(THEME_KEY);
	const isDark =
		cacheTheme === "dark" || document.documentElement.dataset.theme === "dark";
	if (isDark) {
		document.documentElement.dataset.theme = "light";
		storage.set(THEME_KEY, "light");
	} else {
		document.documentElement.dataset.theme = "dark";
		storage.set(THEME_KEY, "dark");
	}
};

const isActiveRoute = ({ isActive }: { isActive: boolean }) => {
	if (isActive) {
		return `${styles.SidePanelItem} ${styles.isActive}`;
	} else {
		return styles.SidePanelItem;
	}
};

type Props = {
	onLogout: () => void;
};

const LogoutButton = ({ onLogout }: { onLogout: () => void }) => {
	return (
		<button type="button" onClick={onLogout} className={styles.LogoutButton}>
			<svg className={styles.LogoutButton_icon}>
				<use xlinkHref={`${sprite}#icon-logout`}></use>
			</svg>
		</button>
	);
};

type SidePanelProps = {
	closePanel: () => void;
	onSelect: () => void;
};

const SidePanel = ({ closePanel, onSelect }: SidePanelProps) => {
	const panelRef = useRef<HTMLDivElement>(null);
	useOutsideClick(panelRef, closePanel);

	return (
		<div className={`${styles.SidePanel} ${styles.slideIn}`} ref={panelRef}>
			<div className={styles.SidePanel_top}>{/*  */}</div>
			<div className={styles.SidePanel_main}>
				<div className={styles.SidePanel_main_section}>Workouts</div>
				<ul className={styles.SidePanel_main_list}>
					<li className={styles.SidePanelItem} onClick={onSelect}>
						<NavLink to="goals" className={isActiveRoute}>
							Goals
						</NavLink>
					</li>
					<li className={styles.SidePanelItem} onClick={onSelect}>
						<NavLink to="trends" className={isActiveRoute}>
							Trends
						</NavLink>
					</li>
					<li className={styles.SidePanelItem} onClick={onSelect}>
						<NavLink to="awards" className={isActiveRoute}>
							Awards & Streaks
						</NavLink>
					</li>
				</ul>
				<div className={styles.SidePanel_main_section}>Other</div>
				<ul className={styles.SidePanel_main_list}>
					<li className={styles.SidePanelItem} onClick={onSelect}>
						<NavLink to="habits" className={isActiveRoute}>
							Habits
						</NavLink>
					</li>
					<li className={styles.SidePanelItem} onClick={onSelect}>
						<NavLink to="ai" className={isActiveRoute}>
							AI Chat
						</NavLink>
					</li>
					<li className={styles.SidePanelItem} onClick={onSelect}>
						<NavLink to="demo" className={isActiveRoute}>
							Demos
						</NavLink>
					</li>
				</ul>
			</div>
			<div className={styles.SidePanel_bottom}>{/*  */}</div>
			{/*  */}
			{/*  */}
		</div>
	);
};

const getDateRange = (lastXDays: number = 7) => {
	const today = new Date();
	const baseDate = subDays(today, 1);
	const start = subDays(baseDate, lastXDays);
	const end = baseDate;

	const startDate = formatDate(start, "db");
	const endDate = formatDate(end, "db");

	console.group("Date Range:");
	console.log("startDate", startDate);
	console.log("endDate", endDate);
	console.log("start", start);
	console.log("end", end);
	console.groupEnd();

	return {
		startDate,
		endDate,
	};
};

const TopNav = ({ onLogout }: Props) => {
	const dateRange = getDateRange();
	const [showSidePanel, setShowSidePanel] = useState<boolean>(false);
	const [showWeeklyRecap, setShowWeeklyRecap] = useState<boolean>(false);

	const openPanel = () => setShowSidePanel(true);
	const closePanel = () => setShowSidePanel(false);

	const openRecap = () => setShowWeeklyRecap(true);
	const closeRecap = () => setShowWeeklyRecap(false);

	const selectLink = () => {
		closePanel();
	};

	return (
		<nav className={styles.TopNav}>
			<ul className={styles.TopNav_list}>
				<li className={styles.TopNav_list_item} onClick={openPanel}>
					<svg className={styles.TopNav_list_item_icon}>
						<use xlinkHref={`${sprite2}#icon-sidebar`}></use>
					</svg>
				</li>
				<li
					className={styles.TopNav_list_item}
					onClick={openRecap}
					data-recap="true"
				>
					<svg className={styles.TopNav_list_item_icon}>
						<use xlinkHref={`${sprite}#icon-delivery-time`}></use>
					</svg>
				</li>
				<li className={styles.TopNav_list_item} onClick={toggleTheme}>
					<svg className={styles.TopNav_list_item_icon}>
						<use xlinkHref={`${sprite2}#icon-brightness_4`}></use>
					</svg>
				</li>
				<li className={styles.TopNav_list_item}>
					<LogoutButton onLogout={onLogout} />
				</li>
			</ul>

			{showSidePanel && (
				<SidePanel closePanel={closePanel} onSelect={selectLink} />
			)}

			{showWeeklyRecap && (
				<WeeklyRecap onClose={closeRecap} dateRange={dateRange} />
			)}
		</nav>
	);
};

export default TopNav;
