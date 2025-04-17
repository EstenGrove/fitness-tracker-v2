import NoData from "../components/ui/NoData";
import styles from "../css/views/OtherHistory.module.scss";
import { useSelector } from "react-redux";
import { formatDate, getWeekStartAndEnd } from "../utils/utils_dates";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHistoryByRangeAndTypeQuery } from "../features/history/historyApi";
import { OtherHistory as OtherLog } from "../features/history/types";

const OtherHistory = () => {
	const { startDate, endDate } = getWeekStartAndEnd();
	const currentUser = useSelector(selectCurrentUser);
	const { data, isLoading } = useGetHistoryByRangeAndTypeQuery({
		userID: currentUser.userID,
		activityType: "Other",
		startDate: formatDate(startDate, "db"),
		endDate: formatDate(endDate, "db"),
	});
	const history = data as OtherLog[];

	return (
		<div className={styles.OtherHistory}>
			<h2>Other History</h2>
			{data && (
				<div className={styles.OtherHistory_list}>
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			)}
			{!history && (
				<div className={styles.OtherHistory_empty}>
					<NoData icon="noData2" msg="No other history found." />
				</div>
			)}
		</div>
	);
};

export default OtherHistory;
