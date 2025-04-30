import NoData from "../components/ui/NoData";
import styles from "../css/views/TimedHistory.module.scss";
import { getWeekStartAndEnd } from "../utils/utils_dates";
import { TimedHistory as TimedLog } from "../features/history/types";
import { useHistoryForRangeAndType } from "../hooks/useHistoryForRangeAndType";

const TimedHistory = () => {
	const { startDate, endDate } = getWeekStartAndEnd();
	const { data, isLoading } = useHistoryForRangeAndType<TimedLog>({
		startDate: startDate,
		endDate: endDate,
		activityType: "Timed",
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
