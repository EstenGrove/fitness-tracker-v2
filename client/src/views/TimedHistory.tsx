import NoData from "../components/ui/NoData";
import styles from "../css/views/TimedHistory.module.scss";
import {
	HistoryOfType,
	TimedHistory as TimedLog,
} from "../features/history/types";
import { useHistoryForRangeAndType } from "../hooks/useHistoryForRangeAndType";
import { isEmptyArray } from "../utils/utils_misc";
import { getTotalMins } from "../utils/utils_history";
import { MenuAction } from "../components/shared/MenuDropdown";
import { useState } from "react";
import HistoryEntry from "../components/history/HistoryEntry";
import { EMenuAction } from "../features/types";
import ModalLG from "../components/shared/ModalLG";
import FadeSlideIn from "../components/ui/FadeSlideIn";
import { useSelector } from "react-redux";
import { selectHistoryRange } from "../features/history/historySlice";

const TimedHistory = () => {
	const { startDate, endDate } = useSelector(selectHistoryRange);
	const [modalType, setModalType] = useState<MenuAction | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<HistoryOfType | null>(
		null
	);
	const { data, isLoading } = useHistoryForRangeAndType<TimedLog>({
		startDate: startDate,
		endDate: endDate,
		activityType: "Timed",
	});
	const history = data as TimedLog[];
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
					Total: {totalMins} mins.
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
			{modalType === EMenuAction.VIEW && (
				<ModalLG onClose={closeActionModal}>
					{/*  */}
					{/*  */}
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
