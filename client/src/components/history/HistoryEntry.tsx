import { ReactNode, useRef, useState } from "react";
import sprite from "../../assets/icons/main.svg";
import styles from "../../css/history/HistoryEntry.module.scss";
import { HistoryOfType } from "../../features/history/types";
import { formatDateAsWeekDay, formatDateTime } from "../../utils/utils_dates";
import { EMenuAction } from "../../features/types";
import MenuDropdown, { MenuAction, MenuIcon } from "../shared/MenuDropdown";
import { isToday } from "date-fns";

type Props = {
	entry: HistoryOfType;
	children?: ReactNode;
	onMenuAction: (action: MenuAction, entry: HistoryOfType) => void;
};

const MinsBadge = ({ mins }: { mins: number }) => {
	return (
		<div className={styles.MinsBadge}>
			<svg className={styles.MinsBadge_icon}>
				<use xlinkHref={`${sprite}#icon-time`}></use>
			</svg>
			<span>{mins}m</span>
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
	if (isToday(startTime)) {
		return "Today";
	} else {
		return formatDateAsWeekDay(startTime);
	}
};

const HistoryEntry = ({ entry, onMenuAction, children }: Props) => {
	const name = entry.workoutName;
	const day = getWorkoutDate(entry.startTime);
	const menuRef = useRef<HTMLDivElement>(null);
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
		<div className={styles.HistoryEntry}>
			<div className={styles.HistoryEntry_top}>
				<div className={styles.HistoryEntry_top_title}>
					<h2>{name}</h2>
					<div className={styles.HistoryEntry_top_title_day}>{day}</div>
				</div>

				<div className={styles.HistoryEntry_top_icon} ref={menuRef}>
					<MenuIcon openMenu={openMoreOpts} />
					{showMenu && (
						<MenuDropdown
							closeMenu={closeMoreOpts}
							usePortal={true}
							triggerRef={menuRef}
						>
							<li onClick={() => handleMenu(EMenuAction.VIEW, entry)}>View</li>
							<li onClick={() => handleMenu(EMenuAction.EDIT, entry)}>Edit</li>
							<li onClick={() => handleMenu(EMenuAction.DELETE, entry)}>
								Delete
							</li>
						</MenuDropdown>
					)}
				</div>
			</div>
			<div className={styles.HistoryEntry_bottom}>
				<MinsBadge mins={entry.duration} />
				{children}
				<WhenBadge startTime={entry.startTime} />
			</div>
		</div>
	);
};

export default HistoryEntry;
