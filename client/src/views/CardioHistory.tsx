import NoData from "../components/ui/NoData";
import styles from "../css/views/CardioHistory.module.scss";
import {
	CardioHistory as CardioLog,
	HistoryOfType,
} from "../features/history/types";
import { MenuAction } from "../components/shared/MenuDropdown";
import { useState } from "react";
import { EMenuAction } from "../features/types";
import { isEmptyArray } from "../utils/utils_misc";
import { getTotalMins } from "../utils/utils_history";
import { useHistoryForRangeAndType } from "../hooks/useHistoryForRangeAndType";
import { useSelector } from "react-redux";
import { selectHistoryRange } from "../features/history/historySlice";
import HistoryEntry from "../components/history/HistoryEntry";
import ModalLG from "../components/shared/ModalLG";
import FadeSlideIn from "../components/ui/FadeSlideIn";

const CardioHistory = () => {
	const { startDate, endDate } = useSelector(selectHistoryRange);
	const [modalType, setModalType] = useState<MenuAction | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<HistoryOfType | null>(
		null
	);
	const { data } = useHistoryForRangeAndType<CardioLog>({
		startDate: startDate,
		endDate: endDate,
		activityType: "Cardio",
	});

	const history = data as CardioLog[];
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
		<div className={styles.CardioHistory}>
			<div className={styles.CardioHistory_header}>
				<h2 className={styles.CardioHistory_header_title}>Strength History</h2>
				<div className={styles.CardioHistory_header_total}>
					Total: {totalMins} mins.
				</div>
			</div>
			{hasHistory && (
				<div className={styles.CardioHistory_list}>
					{history &&
						history.map((entry, idx) => {
							const delay = idx * 650;
							const key = `${entry.historyID}-${delay}-${idx}`;
							return (
								<FadeSlideIn duration={delay} key={key}>
									{/* <div key={key} className={styles.HistoryWrapper}> */}
									<HistoryEntry
										key={entry.historyID}
										entry={entry}
										onMenuAction={onMenuAction}
									/>
									{/* </div> */}
								</FadeSlideIn>
							);
						})}
				</div>
			)}
			{!hasHistory && (
				<div className={styles.CardioHistory_empty}>
					<NoData icon="noData2" msg="No cardio history found." />
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

export default CardioHistory;
