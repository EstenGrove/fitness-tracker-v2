import NoData from "../components/ui/NoData";
import styles from "../css/views/OtherHistory.module.scss";
import { getWeekStartAndEnd } from "../utils/utils_dates";
import { OtherHistory as OtherLog } from "../features/history/types";
import { useHistoryForRangeAndType } from "../hooks/useHistoryForRangeAndType";

const OtherHistory = () => {
	const { startDate, endDate } = getWeekStartAndEnd();
	const { data, isLoading } = useHistoryForRangeAndType<OtherLog>({
		startDate: startDate,
		endDate: endDate,
		activityType: "Other",
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
