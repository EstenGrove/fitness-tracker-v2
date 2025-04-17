import NoData from "../components/ui/NoData";
import styles from "../css/views/WalkHistory.module.scss";
import { useSelector } from "react-redux";
import { formatDate, getWeekStartAndEnd } from "../utils/utils_dates";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHistoryByRangeAndTypeQuery } from "../features/history/historyApi";
import {
	HistoryOfType,
	WalkHistory as WalkLog,
} from "../features/history/types";
import { isEmptyArray } from "../utils/utils_misc";
import WalkHistoryEntry from "../components/history/WalkHistoryEntry";
import { MenuAction } from "../components/shared/MenuDropdown";
import { useState } from "react";
import { EMenuAction } from "../features/types";
import ModalLG from "../components/shared/ModalLG";
import { getTotalMins } from "../utils/utils_history";

const WalkHistory = () => {
	const { startDate, endDate } = getWeekStartAndEnd();
	const currentUser = useSelector(selectCurrentUser);
	const [modalType, setModalType] = useState<MenuAction | null>(null);
	const [selectedEntry, setSelectedEntry] = useState<HistoryOfType | null>(
		null
	);
	const { data, isLoading } = useGetHistoryByRangeAndTypeQuery({
		userID: currentUser.userID,
		activityType: "Walk",
		startDate: formatDate(startDate, "db"),
		endDate: formatDate(endDate, "db"),
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
						history.map((entry) => {
							return (
								<WalkHistoryEntry
									key={entry.historyID}
									entry={entry}
									onMenuAction={onMenuAction}
								/>
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

export default WalkHistory;
