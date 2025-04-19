import { useSelector } from "react-redux";
import NoData from "../components/ui/NoData";
import styles from "../css/views/StrengthHistory.module.scss";
import { formatDate, getWeekStartAndEnd } from "../utils/utils_dates";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHistoryByRangeAndTypeQuery } from "../features/history/historyApi";
import {
	HistoryOfType,
	StrengthHistory as StrengthLog,
} from "../features/history/types";
import { useState } from "react";
import { MenuAction } from "../components/shared/MenuDropdown";
import { isEmptyArray } from "../utils/utils_misc";
import StrengthHistoryEntry from "../components/history/StrengthHistoryEntry";
import { EMenuAction } from "../features/types";
import ModalLG from "../components/shared/ModalLG";
import { getTotalMins } from "../utils/utils_history";

const StrengthHistory = () => {
	const { startDate, endDate } = getWeekStartAndEnd();
	const currentUser = useSelector(selectCurrentUser);
	const [modalType, setModalType] = useState<MenuAction | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<HistoryOfType | null>(
		null
	);
	const { data, isLoading } = useGetHistoryByRangeAndTypeQuery({
		userID: currentUser.userID,
		activityType: "Strength",
		startDate: formatDate(startDate, "db"),
		endDate: formatDate(endDate, "db"),
	});
	const history = (data || []) as StrengthLog[];
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
					Total: {totalMins} mins.
				</div>
			</div>
			{hasHistory && (
				<div className={styles.StrengthHistory_list}>
					{history &&
						history.map((entry) => {
							return (
								<StrengthHistoryEntry
									key={entry.historyID}
									entry={entry}
									onMenuAction={onMenuAction}
								/>
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

export default StrengthHistory;
