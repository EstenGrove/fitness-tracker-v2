import styles from "../../css/recent-activity/SegmentBreakdown.module.scss";
import { Segment } from "../../features/recent-activity/types";
import ProgressBar from "../ui/ProgressBar";

type Props = {
	segments: Segment[];
};

type ActivitySegmentProps = {
	segment: Segment;
};

const formatAsHoursAndMins = (totalMinutes: number): string => {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	const hourPart = hours > 0 ? `${hours} hr` : "";
	const minutePart = minutes > 0 ? `${minutes} min` : "";

	return [hourPart, minutePart].filter(Boolean).join(" ");
};

const ActivitySegment = ({ segment }: ActivitySegmentProps) => {
	const css = { height: "1.2rem" };
	const percent = segment.percent + "%";
	const duration = formatAsHoursAndMins(segment.mins);

	return (
		<div className={styles.ActivitySegment}>
			<div className={styles.ActivitySegment_prefix}>
				<div className={styles.ActivitySegment_prefix_percent}>{percent}</div>
			</div>
			<div className={styles.ActivitySegment_progress}>
				<ProgressBar
					progress={segment.percent}
					color={"var(--blueGrey300)"}
					style={css}
				/>
			</div>
			<div className={styles.ActivitySegment_duration}>{duration}</div>
		</div>
	);
};

const SegmentBreakdown = ({ segments }: Props) => {
	return (
		<div className={styles.SegmentBreakdown}>
			<div className={styles.SegmentBreakdown_inner}>
				{segments.map((segment, idx) => {
					const key = `${segment.mins}-${idx}`;
					return <ActivitySegment key={key} segment={segment} />;
				})}
			</div>
		</div>
	);
};

export default SegmentBreakdown;
