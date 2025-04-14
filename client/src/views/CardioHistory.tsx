import { useSelector } from "react-redux";
import NoData from "../components/ui/NoData";
import styles from "../css/views/CardioHistory.module.scss";
import { useGetHistoryByRangeAndTypeQuery } from "../features/history/historyApi";
import { selectCurrentUser } from "../features/user/userSlice";
import { getLastXMonthsRange } from "../utils/utils_dates";
import { CardioHistory as CardioLog } from "../features/history/types";

const CardioHistory = () => {
	const range = getLastXMonthsRange(3);
	const currentUser = useSelector(selectCurrentUser);
	const { data, isLoading } = useGetHistoryByRangeAndTypeQuery({
		userID: currentUser.userID,
		activityType: "Cardio",
		...range,
	});
	const history = data as CardioLog[];
	return (
		<div className={styles.CardioHistory}>
			<h2>Cardio History</h2>
			{data && (
				<div className={styles.CardioHistory_list}>
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			)}
			{!history && (
				<div className={styles.CardioHistory_empty}>
					<NoData icon="noData2" msg="No cardio history found." />
				</div>
			)}
		</div>
	);
};

export default CardioHistory;
