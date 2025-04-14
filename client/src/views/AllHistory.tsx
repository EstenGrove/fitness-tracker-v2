import { useSelector } from "react-redux";
import NoData from "../components/ui/NoData";
import styles from "../css/views/AllHistory.module.scss";
import { useGetHistoryForRangeQuery } from "../features/history/historyApi";
import { selectCurrentUser } from "../features/user/userSlice";
import { AllHistory as AllHistoryLogs } from "../features/history/types";

const getLastXDays = () => {
	return {
		startDate: "",
		endDate: "",
	};
};

const AllHistory = () => {
	const range = getLastXDays();
	const currentUser = useSelector(selectCurrentUser);
	const { data, isLoading } = useGetHistoryForRangeQuery({
		userID: currentUser.userID,
		...range,
	});
	const allHistory = data as AllHistoryLogs;
	return (
		<div className={styles.AllHistory}>
			<h2>All History</h2>
			{data && (
				<div className={styles.AllHistory_list}>
					{/*  */}
					{/*  */}
					{/*  */}
				</div>
			)}
			{!allHistory && (
				<div className={styles.AllHistory_empty}>
					<NoData icon="noData2" msg="No history found." />
				</div>
			)}
		</div>
	);
};

export default AllHistory;
