import { useSelector } from "react-redux";
import NoData from "../components/ui/NoData";
import styles from "../css/views/StrengthHistory.module.scss";
import { getLastXMonthsRange } from "../utils/utils_dates";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHistoryByRangeAndTypeQuery } from "../features/history/historyApi";
import { StrengthHistory as StrengthLog } from "../features/history/types";

const StrengthHistory = () => {
	const range = getLastXMonthsRange(3);
	const currentUser = useSelector(selectCurrentUser);
	const { data, isLoading } = useGetHistoryByRangeAndTypeQuery({
		userID: currentUser.userID,
		activityType: "Strength",
		...range,
	});
	const history = data as StrengthLog[];

	return (
		<div className={styles.StrengthHistory}>
			<h2>Strength History</h2>
			{data && (
				<div className={styles.StrengthHistory_list}>
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			)}
			{history && (
				<div className={styles.StrengthHistory_empty}>
					<NoData icon="noData2" msg="No strength history found." />
				</div>
			)}
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default StrengthHistory;
