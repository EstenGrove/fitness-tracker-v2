import NoData from "../components/ui/NoData";
import styles from "../css/views/StretchHistory.module.scss";
import {
	HistoryOfType,
	StretchHistory as StretchLog,
} from "../features/history/types";
import { useHistoryForRangeAndType } from "../hooks/useHistoryForRangeAndType";
import { isEmptyArray } from "../utils/utils_misc";
import { getTotalMins } from "../utils/utils_history";
import { MenuAction } from "../components/shared/MenuDropdown";
import { useState } from "react";
import { EMenuAction } from "../features/types";
import HistoryEntry from "../components/history/HistoryEntry";
import ModalLG from "../components/shared/ModalLG";
import FadeSlideIn from "../components/ui/FadeSlideIn";
import { useSelector } from "react-redux";
import { selectHistoryRange } from "../features/history/historySlice";
import HistoryDetails from "../components/details/HistoryDetails";

const StretchHistory = () => {
	const { startDate, endDate } = useSelector(selectHistoryRange);
	const [modalType, setModalType] = useState<MenuAction | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<HistoryOfType | null>(
		null
	);
	const { data } = useHistoryForRangeAndType<StretchLog>({
		startDate: startDate,
		endDate: endDate,
		activityType: "Stretch",
	});
	const history = data as StretchLog[];
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
		<div className={styles.StretchHistory}>
			<div className={styles.StretchHistory_header}>
				<h2 className={styles.StretchHistory_header_title}>Stretch History</h2>
				<div className={styles.StretchHistory_header_total}>
					Total: {Math.round(totalMins)} mins.
				</div>
			</div>
			{hasHistory && (
				<div className={styles.StretchHistory_list}>
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
				<div className={styles.StretchHistory_empty}>
					<NoData icon="noData2" msg="No stretch history found." />
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

export default StretchHistory;
