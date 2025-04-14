import NoData from "../components/ui/NoData";
import styles from "../css/views/TimedHistory.module.scss";
import { getLastXMonthsRange } from "../utils/utils_dates";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHistoryByRangeAndTypeQuery } from "../features/history/historyApi";
import { useSelector } from "react-redux";
import { TimedHistory as TimedLog } from "../features/history/types";

const TimedHistory = () => {
	const range = getLastXMonthsRange(3);
	const currentUser = useSelector(selectCurrentUser);
	const { data, isLoading } = useGetHistoryByRangeAndTypeQuery({
		userID: currentUser.userID,
		activityType: "Timed",
		...range,
	});
	const history = data as TimedLog[];
	return (
		<div className={styles.TimedHistory}>
			<h2>Timed History</h2>
			{data && (
				<div className={styles.TimedHistory_list}>
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			)}
			{!history && (
				<div className={styles.TimedHistory_empty}>
					<NoData icon="noData2" msg="No timed history found." />
				</div>
			)}
		</div>
	);
};

export default TimedHistory;
