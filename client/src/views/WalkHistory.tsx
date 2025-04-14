import NoData from "../components/ui/NoData";
import styles from "../css/views/WalkHistory.module.scss";
import { useSelector } from "react-redux";
import { getLastXMonthsRange } from "../utils/utils_dates";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHistoryByRangeAndTypeQuery } from "../features/history/historyApi";
import { WalkHistory as WalkLog } from "../features/history/types";

const WalkHistory = () => {
	const range = getLastXMonthsRange(3);
	const currentUser = useSelector(selectCurrentUser);
	const { data, isLoading } = useGetHistoryByRangeAndTypeQuery({
		userID: currentUser.userID,
		activityType: "Walk",
		...range,
	});
	const history = data as WalkLog[];
	return (
		<div className={styles.WalkHistory}>
			<h2>Walk History</h2>
			{data && (
				<div className={styles.WalkHistory_list}>
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			)}
			{!history && (
				<div className={styles.WalkHistory_empty}>
					<NoData icon="noData2" msg="No walking history found." />
				</div>
			)}
		</div>
	);
};

export default WalkHistory;
