import NoData from "../components/ui/NoData";
import styles from "../css/views/OtherHistory.module.scss";
import {
	HistoryOfType,
	OtherHistory as OtherLog,
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
import HistoryDetails from "../components/details/HistoryDetails";

const OtherHistory = () => {
	const { startDate, endDate } = useSelector(selectHistoryRange);
	const { data } = useHistoryForRangeAndType<OtherLog>({
		startDate: startDate,
		endDate: endDate,
		activityType: "Other",
	});
	const [modalType, setModalType] = useState<MenuAction | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<HistoryOfType | null>(
		null
	);
	const history = data as OtherLog[];
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
		<div className={styles.OtherHistory}>
			<div className={styles.OtherHistory_header}>
				<h2 className={styles.OtherHistory_header_title}>Other History</h2>
				<div className={styles.OtherHistory_header_total}>
					Total: {totalMins.toFixed(2)} mins.
				</div>
			</div>
			{hasHistory && (
				<div className={styles.OtherHistory_list}>
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
				<div className={styles.OtherHistory_empty}>
					<NoData icon="noData2" msg="No other history found." />
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

export default OtherHistory;
