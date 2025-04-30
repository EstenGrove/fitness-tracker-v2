import NoData from "../components/ui/NoData";
import styles from "../css/views/StretchHistory.module.scss";
import { getWeekStartAndEnd } from "../utils/utils_dates";
import { StretchHistory as StretchLog } from "../features/history/types";
import { useHistoryForRangeAndType } from "../hooks/useHistoryForRangeAndType";

const StretchHistory = () => {
	const { startDate, endDate } = getWeekStartAndEnd();
	const { data, isLoading } = useHistoryForRangeAndType<StretchLog>({
		startDate: startDate,
		endDate: endDate,
		activityType: "Stretch",
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
