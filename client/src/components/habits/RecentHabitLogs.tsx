import { useState } from "react";
import sprite from "../../assets/icons/habits.svg";
import styles from "../../css/habits/RecentHabitLogs.module.scss";
import { HabitLog, RecentHabitLog } from "../../features/habits/types";
import { addEllipsis } from "../../utils/utils_misc";
import { format, formatDistanceToNow, isToday } from "date-fns";
import { habitIcons } from "../../utils/utils_habits";
import ModalLG from "../shared/ModalLG";
import RecentLogDetails from "./RecentLogDetails";

type Props = {
	recentLogs: RecentHabitLog[];
};

type RecentLogProps = {
	logEntry: RecentHabitLog;
	onSelect: () => void;
};

const getWhen = (logEntry: RecentHabitLog) => {
	const today = isToday(logEntry.logTime);
	const when = formatDistanceToNow(logEntry.logTime);
	const ago = when + " ago";
	if (today) {
		return `${ago}`;
	}
	const day = format(logEntry.logTime, "iii");
	const date = format(logEntry.logTime, "M/d");
	return `${ago} (${day}. ${date})`;
};

const RecentLog = ({ logEntry, onSelect }: RecentLogProps) => {
	const name = addEllipsis(logEntry.habitName, 25);
	const when = getWhen(logEntry);
	const icon = habitIcons[logEntry.icon];
	const color = { fill: logEntry.iconColor };
	return (
		<div className={styles.RecentLog} onClick={onSelect}>
			<div className={styles.RecentLog_top}>
				<svg className={styles.RecentLog_top_icon} style={color}>
					<use xlinkHref={`${sprite}#icon-${icon}`}></use>
				</svg>
				<h4 className={styles.RecentLog_top_title}>{name}</h4>
			</div>
			<div className={styles.RecentLog_top_when}>{when}</div>
		</div>
	);
};

const RecentHabitLogs = ({ recentLogs }: Props) => {
	const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
	const [selectedEntry, setSelectedEntry] = useState<HabitLog | null>(null);

	const openDetails = () => {
		setShowDetailsModal(true);
	};
	const closeDetails = () => {
		setShowDetailsModal(false);
		setSelectedEntry(null);
	};

	const selectEntry = (entry: HabitLog) => {
		setSelectedEntry(entry);
		openDetails();
	};

	return (
		<div className={styles.RecentHabitLogs}>
			<div className={styles.RecentHabitLogs_list}>
				{recentLogs &&
					recentLogs.map((log, idx) => {
						const key = `${log.logID}-${idx}`;
						return (
							<RecentLog
								key={key}
								logEntry={log}
								onSelect={() => selectEntry(log)}
							/>
						);
					})}
			</div>

			{showDetailsModal && !!selectedEntry && (
				<ModalLG onClose={closeDetails}>
					<RecentLogDetails recentLog={selectedEntry as RecentHabitLog} />
				</ModalLG>
			)}
		</div>
	);
};

export default RecentHabitLogs;
