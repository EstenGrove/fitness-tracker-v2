import styles from "../css/views/AllHistory.module.scss";
import { HistoryOfType, WorkoutHistory } from "../features/history/types";
import { MenuAction } from "../components/shared/MenuDropdown";
import { useState } from "react";
import { getTotalMins } from "../utils/utils_history";
import { formatCustomDate, formatDate } from "../utils/utils_dates";
import { groupByFn, TRecord } from "../utils/utils_misc";
import { EMenuAction } from "../features/types";
import { parseISO } from "date-fns";
import { useHistoryForRange } from "../hooks/useHistoryForRange";
import { useSelector } from "react-redux";
import { selectHistoryRange } from "../features/history/historySlice";
import NoData from "../components/ui/NoData";
import Loader from "../components/layout/Loader";
import AllHistoryEntry from "../components/history/AllHistoryEntry";
import ModalLG from "../components/shared/ModalLG";
import FadeSlideIn from "../components/ui/FadeSlideIn";
import HistoryDetails from "../components/details/HistoryDetails";
import EditHistory from "../components/history/EditHistory";

type GroupedHistory = TRecord<WorkoutHistory>;

const groupHistoryByDate = (allLogs: WorkoutHistory[]): GroupedHistory => {
	if (!history || !history.length) return {};
	const grouped = groupByFn<WorkoutHistory>(allLogs, (x) =>
		formatDate(x.startTime, "db")
	);

	return grouped;
};

type HistoryByDateProps = {
	date: string;
	history: HistoryOfType[];
	onMenuAction: (action: MenuAction, entry: HistoryOfType) => void;
};
const HistoryByDate = ({ date, history, onMenuAction }: HistoryByDateProps) => {
	const dateLabel = formatCustomDate(date, "monthAndDay");
	const numOfWorkouts = history.length || 0;
	const sorted = history.sort((a, b) => {
		const timeA = new Date(a.startTime).getTime();
		const timeB = new Date(b.startTime).getTime();
		return timeB - timeA;
	});
	return (
		<div className={styles.HistoryByDate}>
			<div className={styles.HistoryByDate_header}>
				<div className={styles.HistoryByDate_header_title}>{dateLabel}</div>
				<div className={styles.HistoryByDate_header_count}>
					Workouts: {numOfWorkouts}
				</div>
			</div>
			<div className={styles.HistoryByDate_list}>
				{sorted &&
					sorted.map((entry, idx) => {
						const key = `${entry.historyID}-${idx}`;
						return (
							<AllHistoryEntry
								key={key}
								entry={entry}
								onMenuAction={onMenuAction}
							/>
						);
					})}
			</div>
		</div>
	);
};

// Processes a date string ('2025-04-13') to be formatted properly
// ...this is due to that format being recognized as ISO and formatting it
// ..will result in being off by one day
const prepareDate = (date: string) => {
	const parsed = parseISO(date);
	const target = parsed.toString();
	return target;
};

const getGroupedKeys = (grouped: GroupedHistory): string[] => {
	const dates = Object.keys(grouped).sort((a, b) => {
		const dateA = new Date(a).getTime();
		const dateB = new Date(b).getTime();
		return dateB - dateA;
	});
	return dates;
};

const AllHistory = () => {
	const { startDate, endDate } = useSelector(selectHistoryRange);
	const [modalType, setModalType] = useState<MenuAction | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<HistoryOfType | null>(
		null
	);
	const { data: allHistory, isLoading } = useHistoryForRange(
		startDate,
		endDate
	);
	const all: WorkoutHistory[] = allHistory?.all || [];
	const grouped: GroupedHistory = groupHistoryByDate(all);
	const dates: string[] = getGroupedKeys(grouped);
	const totalMins = getTotalMins(all as HistoryOfType[]);

	const onMenuAction = (action: MenuAction, entry: HistoryOfType) => {
		setModalType(action);
		setSelectedEntry(entry);
	};

	const closeActionModal = () => {
		setModalType(null);
		setSelectedEntry(null);
	};

	return (
		<div className={styles.AllHistory}>
			<div className={styles.AllHistory_header}>
				<h2 className={styles.AllHistory_header_title}>All History</h2>
				<div className={styles.AllHistory_header_total}>
					Total: {totalMins} mins.
				</div>
			</div>
			{isLoading ? (
				<div className={styles.AllHistory_list}>
					<Loader>
						<span>Loading all history...please wait..</span>
					</Loader>
				</div>
			) : (
				<>
					{all.length > 0 && (
						<div className={styles.AllHistory_list}>
							{dates &&
								dates.map((date, idx) => {
									const delay = idx * 150;
									const historyForDate = grouped[date];
									const target = prepareDate(date);

									return (
										<FadeSlideIn delay={delay} key={delay}>
											<HistoryByDate
												key={date + idx}
												date={target}
												history={historyForDate as HistoryOfType[]}
												onMenuAction={onMenuAction}
											/>
										</FadeSlideIn>
									);
								})}
						</div>
					)}
					{!all.length && (
						<div className={styles.AllHistory_empty}>
							<NoData icon="noData2" msg="No history found." />
						</div>
					)}
				</>
			)}

			{/* VIEW MODAL */}
			{selectedEntry && modalType === EMenuAction.VIEW && (
				<ModalLG onClose={closeActionModal}>
					<HistoryDetails history={selectedEntry as HistoryOfType} />
				</ModalLG>
			)}
			{/* EDIT MODAL */}
			{selectedEntry && modalType === EMenuAction.EDIT && (
				<ModalLG onClose={closeActionModal}>
					<EditHistory historyEntry={selectedEntry} />
				</ModalLG>
			)}
		</div>
	);
};

export default AllHistory;
