import NoData from "../components/ui/NoData";
import styles from "../css/views/WalkHistory.module.scss";
import {
	HistoryOfType,
	WalkHistory as WalkLog,
} from "../features/history/types";
import { isEmptyArray } from "../utils/utils_misc";
import { MenuAction } from "../components/shared/MenuDropdown";
import { useState } from "react";
import { EMenuAction } from "../features/types";
import { getTotalMins } from "../utils/utils_history";
import { useHistoryForRangeAndType } from "../hooks/useHistoryForRangeAndType";
import { useSelector } from "react-redux";
import { selectHistoryRange } from "../features/history/historySlice";
import WalkHistoryEntry from "../components/history/WalkHistoryEntry";
import ModalLG from "../components/shared/ModalLG";
import FadeSlideIn from "../components/ui/FadeSlideIn";
import HistoryDetails from "../components/details/HistoryDetails";

const WalkHistory = () => {
	const { startDate, endDate } = useSelector(selectHistoryRange);
	const [modalType, setModalType] = useState<MenuAction | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<HistoryOfType | null>(
		null
	);
	const { data } = useHistoryForRangeAndType<WalkLog>({
		startDate: startDate,
		endDate: endDate,
		activityType: "Walk",
	});
	const history = data as WalkLog[];
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
		<div className={styles.WalkHistory}>
			<div className={styles.WalkHistory_header}>
				<h2 className={styles.WalkHistory_header_title}>Walk History</h2>
				<div className={styles.WalkHistory_header_total}>
					Total: {totalMins} mins.
				</div>
			</div>
			{hasHistory && (
				<div className={styles.WalkHistory_list}>
					{history &&
						history.map((entry, idx) => {
							const delay = idx * 650;
							const key = `${delay}-${idx}`;
							return (
								<FadeSlideIn key={key} duration={delay}>
									<WalkHistoryEntry
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
				<div className={styles.WalkHistory_empty}>
					<NoData icon="noData2" msg="No walking history found." />
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

export default WalkHistory;
