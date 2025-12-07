import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "../css/views/TimedHistory.module.scss";
import {
	HistoryOfType,
	TimedHistory as TimedLog,
} from "../features/history/types";
import {
	getTotalMins,
	sortHistoryBy,
	SortHistoryBy,
} from "../utils/utils_history";
import { useHistoryForRangeAndType } from "../hooks/useHistoryForRangeAndType";
import { MenuAction } from "../components/shared/MenuDropdown";
import { isEmptyArray } from "../utils/utils_misc";
import { EMenuAction } from "../features/types";
import { selectHistoryRange } from "../features/history/historySlice";
import NoData from "../components/ui/NoData";
import ModalLG from "../components/shared/ModalLG";
import FadeSlideIn from "../components/ui/FadeSlideIn";
import HistoryEntry from "../components/history/HistoryEntry";
import HistoryDetails from "../components/details/HistoryDetails";

const TimedHistory = () => {
	const { startDate, endDate } = useSelector(selectHistoryRange);
	const [modalType, setModalType] = useState<MenuAction | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<HistoryOfType | null>(
		null
	);
	const { data } = useHistoryForRangeAndType<TimedLog>({
		startDate: startDate,
		endDate: endDate,
		activityType: "Timed",
	});
	const history = useMemo(() => {
		const sort: SortHistoryBy = { by: "startTime", order: "ASC" };
		const sorted = sortHistoryBy(data, sort) as TimedLog[];
		return sorted;
	}, [data]);
	const hasHistory = !isEmptyArray(history);
	const totalMins = getTotalMins(history);

	const onMenuAction = (action: MenuAction, entry: HistoryOfType) => {
		setModalType(action);
		setSelectedEntry(entry);
	};

	const closeActionModal = () => {
		setModalType(null);
		setSelectedEntry(null);
	};
	return (
		<div className={styles.TimedHistory}>
			<div className={styles.TimedHistory_header}>
				<h2 className={styles.TimedHistory_header_title}>Timed History</h2>
				<div className={styles.TimedHistory_header_total}>
					Total: {Math.round(totalMins)} mins.
				</div>
			</div>
			{hasHistory && (
				<div className={styles.TimedHistory_list}>
					{history &&
						history.map((entry, idx) => {
							const delay = idx * 650;
							const key = `${delay}-${idx}`;
							return (
								<FadeSlideIn key={key} duration={delay}>
									<HistoryEntry
										key={entry.historyID}
										entry={entry}
										onMenuAction={onMenuAction}
									/>
								</FadeSlideIn>
							);
						})}
				</div>
			)}
			{!hasHistory && (
				<div className={styles.TimedHistory_empty}>
					<NoData icon="noData2" msg="No timed history found." />
				</div>
			)}

			{/* MODALS */}
			{selectedEntry && modalType === EMenuAction.VIEW && (
				<ModalLG onClose={closeActionModal}>
					<HistoryDetails history={selectedEntry as HistoryOfType} />
				</ModalLG>
			)}
			{modalType === EMenuAction.EDIT && (
				<ModalLG onClose={closeActionModal}>
					{/*  */}
					{/*  */}
				</ModalLG>
			)}
		</div>
	);
};

export default TimedHistory;
