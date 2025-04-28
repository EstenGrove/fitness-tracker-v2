import NoData from "../components/ui/NoData";
import styles from "../css/views/CardioHistory.module.scss";
import { getWeekStartAndEnd } from "../utils/utils_dates";
import {
	CardioHistory as CardioLog,
	HistoryOfType,
} from "../features/history/types";
import HistoryEntry from "../components/history/HistoryEntry";
import { MenuAction } from "../components/shared/MenuDropdown";
import { useState } from "react";
import ModalLG from "../components/shared/ModalLG";
import { EMenuAction } from "../features/types";
import { isEmptyArray } from "../utils/utils_misc";
import { getTotalMins } from "../utils/utils_history";
import { useHistoryForRangeAndType } from "../hooks/useHistoryForRangeAndType";

const CardioHistory = () => {
	const { startDate, endDate } = getWeekStartAndEnd();
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
						history.map((entry) => {
							return (
								<HistoryEntry
									key={entry.historyID}
									entry={entry}
									onMenuAction={onMenuAction}
								/>
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
