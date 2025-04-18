import NoData from "../components/ui/NoData";
import styles from "../css/views/StretchHistory.module.scss";
import { formatDate, getWeekStartAndEnd } from "../utils/utils_dates";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHistoryByRangeAndTypeQuery } from "../features/history/historyApi";
import { StretchHistory as StretchLog } from "../features/history/types";
import { useSelector } from "react-redux";

const StretchHistory = () => {
	const { startDate, endDate } = getWeekStartAndEnd();
	const currentUser = useSelector(selectCurrentUser);
	const { data, isLoading } = useGetHistoryByRangeAndTypeQuery({
		userID: currentUser.userID,
		activityType: "Strength",
		startDate: formatDate(startDate, "db"),
		endDate: formatDate(endDate, "db"),
	});
	const history = data as StretchLog[];
	return (
		<div className={styles.StretchHistory}>
			<h2>Stretch History</h2>
			{data && (
				<div className={styles.StretchHistory_list}>
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			)}
			{!history && (
				<div className={styles.StretchHistory_empty}>
					<NoData icon="noData2" msg="No stretching history found." />
				</div>
			)}
		</div>
	);
};

export default StretchHistory;
