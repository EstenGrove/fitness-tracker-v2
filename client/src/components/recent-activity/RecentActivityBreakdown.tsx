import { parseISO } from "date-fns";
import styles from "../../css/recent-activity/RecentActivityBreakdown.module.scss";
import { Segment, TotalTime } from "../../features/recent-activity/types";
import { DateRange } from "../../features/types";
import { formatCustomDate } from "../../utils/utils_dates";
import { extractHrsAndMins } from "../../utils/utils_formatter";
import TimeCounter from "../ui/TimeCounter";
import ActivitySegments from "./ActivitySegments";
import RingBreakdown from "./RingBreakdown";
import SectionAccordion from "../layout/SectionAccordion";
import { useState } from "react";
import NoSegments from "./NoSegments";
import NoData from "../ui/NoData";

type Props = {
	dateRange: DateRange;
	totalTime: TotalTime;
	segments: Segment[];
};

const getDateRangeDesc = (range: DateRange) => {
	const parsedStart = parseISO(range.startDate as string);
	const parsedEnd = parseISO(range.endDate as string);
	const start = formatCustomDate(parsedStart, "range");
	const end = formatCustomDate(parsedEnd, "range");

	return `${start} - ${end}`;
};

type TitleToggle = "Show" | "Hide";

const RecentActivityBreakdown = ({
	dateRange,
	totalTime,
	segments = [],
}: Props) => {
	// For toggling the the accordion title, based off expanded/collapsed
	const [title, setTitle] = useState<TitleToggle>("Hide");
	const minsTotals = extractHrsAndMins(totalTime.totalMins);
	const rangeDesc = getDateRangeDesc({
		startDate: dateRange.startDate,
		endDate: dateRange.endDate,
	});

	const onToggleAccordion = (isOpen: boolean) => {
		setTitle(isOpen ? "Hide" : "Show");
	};

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
				{!segments || !segments.length ? (
					<NoSegments title="Time Breakdown (no data)" />
				) : (
					<ActivitySegments segments={segments} />
				)}
			</div>
			<div className={styles.RecentActivityBreakdown_breakdown}>
				<SectionAccordion
					title={title + " Breakdown"}
					onToggle={onToggleAccordion}
				>
					{!segments || !segments.length ? (
						<div className={styles.RecentActivityBreakdown_breakdown_empty}>
							<NoData msg="No workouts yet." icon="calendarHistory2" />
						</div>
					) : (
						<RingBreakdown segments={segments} />
					)}
				</SectionAccordion>
			</div>
		</div>
	);
};

export default RecentActivityBreakdown;
