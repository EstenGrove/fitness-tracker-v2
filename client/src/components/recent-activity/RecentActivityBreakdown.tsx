import { parseISO } from "date-fns";
import styles from "../../css/recent-activity/RecentActivityBreakdown.module.scss";
import { Segment, TotalTime } from "../../features/recent-activity/types";
import { DateRange } from "../../features/types";
import { formatCustomDate } from "../../utils/utils_dates";
import { extractHrsAndMins } from "../../utils/utils_formatter";
import RingSegments from "../ui/RingSegments";
import TimeCounter from "../ui/TimeCounter";
import ActivitySegments from "./ActivitySegments";

type Props = {
	dateRange: DateRange;
	totalTime: TotalTime;
	segments: Segment[];
};

const getDateRangeDesc = (range: DateRange) => {
	const parsedStart = parseISO(range.startDate);
	const parsedEnd = parseISO(range.endDate);
	const start = formatCustomDate(parsedStart, "range");
	const end = formatCustomDate(parsedEnd, "range");

	return `${start} - ${end}`;
};

const RecentActivityBreakdown = ({
	dateRange,
	totalTime,
	segments = [],
}: Props) => {
	const minsTotals = extractHrsAndMins(totalTime.totalMins);
	const rangeDesc = getDateRangeDesc({
		startDate: dateRange.startDate,
		endDate: dateRange.endDate,
	});

	console.log("dateRange", dateRange);

	return (
		<div className={styles.RecentActivityBreakdown}>
			<div className={styles.RecentActivityBreakdown_dateRange}>
				<div>Total Workout Time</div>
				<div>{rangeDesc}</div>
			</div>
			<div className={styles.RecentActivityBreakdown_mins}>
				<TimeCounter
					hrs={minsTotals.hrs}
					mins={minsTotals.mins}
					duration={500}
				/>
			</div>
			<div className={styles.RecentActivityBreakdown_segments}>
				<ActivitySegments segments={segments} />
			</div>
			<div className={styles.RecentActivityBreakdown_breakdown}>
				<RingSegments data={segments} />
			</div>
		</div>
	);
};

export default RecentActivityBreakdown;
