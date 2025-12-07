import { ReactNode, useState } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/history/AllHistoryEntry.module.scss";
import { HistoryOfType } from "../../features/history/types";
import { formatDateAsWeekDay, formatDateTime } from "../../utils/utils_dates";
import { EMenuAction } from "../../features/types";
import MenuDropdown, { MenuAction, MenuIcon } from "../shared/MenuDropdown";
import { isToday } from "date-fns";
import { getActivityStyles } from "../../utils/utils_activity";
import { Activity } from "../../features/shared/types";

type Props = {
	entry: HistoryOfType;
	children?: ReactNode;
	onMenuAction: (action: MenuAction, entry: HistoryOfType) => void;
};

const MinsBadge = ({ mins }: { mins: number }) => {
	const cleanMins = Math.round(mins);
	return (
		<div className={styles.MinsBadge}>
			<svg className={styles.MinsBadge_icon}>
				<use xlinkHref={`${sprite}#icon-time`}></use>
			</svg>
			<span>{cleanMins}m</span>
		</div>
	);
};

type WhenProps = {
	startTime: string;
};

const WhenBadge = ({ startTime }: WhenProps) => {
	const when = formatDateTime(startTime, "common");
	return (
		<div className={styles.WhenBadge}>
			<span className={styles.WhenBadge}>{when}</span>
		</div>
	);
};

const getWorkoutDate = (startTime: string): string => {
	const iso = new Date(startTime).toISOString();
	const date = iso.toString();
	if (isToday(date)) {
		return "Today";
	} else {
		return formatDateAsWeekDay(date);
	}
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

const AllHistoryEntry = ({ entry, onMenuAction, children }: Props) => {
	const name = entry.workoutName;
	const activityType = entry.activityType;
	const day = getWorkoutDate(entry.startTime);
	const [showMenu, setShowMenu] = useState<boolean>(false);

	const openMoreOpts = () => {
		setShowMenu(true);
	};
	const closeMoreOpts = () => {
		setShowMenu(false);
	};

	const handleMenu = (action: MenuAction, entry: HistoryOfType) => {
		onMenuAction(action, entry);
		closeMoreOpts();
	};

	return (
		<div className={styles.AllHistoryEntry}>
			<div className={styles.AllHistoryEntry_top}>
				<div className={styles.AllHistoryEntry_top_badge}>
					<TypeBadge activityType={activityType} />
				</div>
				<div className={styles.AllHistoryEntry_top_title}>
					<h2>{name}</h2>
					<div className={styles.AllHistoryEntry_top_title_day}>{day}</div>
				</div>

				<div className={styles.AllHistoryEntry_top_icon}>
					<MenuIcon openMenu={openMoreOpts} />
					{showMenu && (
						<MenuDropdown closeMenu={closeMoreOpts}>
							<li onClick={() => handleMenu(EMenuAction.VIEW, entry)}>View</li>
							<li onClick={() => handleMenu(EMenuAction.EDIT, entry)}>Edit</li>
							<li onClick={() => handleMenu(EMenuAction.DELETE, entry)}>
								Delete
							</li>
						</MenuDropdown>
					)}
				</div>
			</div>
			<div className={styles.AllHistoryEntry_bottom}>
				<MinsBadge mins={entry.duration} />
				{children}
				<WhenBadge startTime={entry.startTime} />
			</div>
		</div>
	);
};

export default AllHistoryEntry;
