import { useState, useMemo } from "react";
import NoData from "../components/ui/NoData";
import styles from "../css/views/StrengthHistory.module.scss";
import {
	HistoryOfType,
	StrengthHistory as StrengthLog,
} from "../features/history/types";
import { MenuAction } from "../components/shared/MenuDropdown";
import { isEmptyArray } from "../utils/utils_misc";
import { EMenuAction } from "../features/types";
import { useSelector } from "react-redux";
import { selectHistoryRange } from "../features/history/historySlice";
import {
	getTotalMins,
	SortHistoryBy,
	sortHistoryBy,
} from "../utils/utils_history";
import ModalLG from "../components/shared/ModalLG";
import StrengthHistoryEntry from "../components/history/StrengthHistoryEntry";
import { useHistoryForRangeAndType } from "../hooks/useHistoryForRangeAndType";
import FadeSlideIn from "../components/ui/FadeSlideIn";
import HistoryDetails from "../components/details/HistoryDetails";

const StrengthHistory = () => {
	const { startDate, endDate } = useSelector(selectHistoryRange);
	const [modalType, setModalType] = useState<MenuAction | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<HistoryOfType | null>(
		null
	);
	const { data } = useHistoryForRangeAndType<StrengthLog>({
		startDate: startDate,
		endDate: endDate,
		activityType: "Strength",
	});

	const history = useMemo(() => {
		const sort: SortHistoryBy = { by: "startTime", order: "ASC" };
		const sorted = sortHistoryBy(data, sort) as StrengthLog[];
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
		<div className={styles.StrengthHistory}>
			<div className={styles.StrengthHistory_header}>
				<h2 className={styles.StrengthHistory_header_title}>
					Strength History
				</h2>
				<div className={styles.StrengthHistory_header_total}>
					Total: {Math.round(totalMins)} mins.
				</div>
			</div>
			{hasHistory && (
				<div className={styles.StrengthHistory_list}>
					{history &&
						history.map((entry, idx) => {
							const delay = idx * 650;
							const key = `${delay}-${idx}`;
							return (
								<FadeSlideIn key={key} duration={delay}>
									<StrengthHistoryEntry
										key={entry.historyID}
										entry={entry}
										onMenuAction={onMenuAction}
									/>
								</FadeSlideIn>
							);
						})}
				</div>
			)}
			{!history.length && (
				<div className={styles.StrengthHistory_empty}>
					<NoData icon="noData2" msg="No strength history found." />
				</div>
			)}

			{/* MODALS */}
			{selectedEntry && modalType === EMenuAction.VIEW && (
				<ModalLG onClose={closeActionModal}>
					<HistoryDetails history={selectedEntry as HistoryOfType} />
				</ModalLG>
			)}
			{selectedEntry && modalType === EMenuAction.EDIT && (
				<ModalLG onClose={closeActionModal}>
					{/*  */}
					{/*  */}
				</ModalLG>
			)}
		</div>
	);
};

export default StrengthHistory;
