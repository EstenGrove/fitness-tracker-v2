import styles from "../../css/recent-activity/ActivitySegments.module.scss";
import { Segment } from "../../features/recent-activity/types";

type Props = {
	label?: string;
	segments: Segment[];
};

type SegmentItemProps = {
	segment: Segment;
};

const SegmentItem = ({ segment }: SegmentItemProps) => {
	const title = `${segment.label}: ${segment.percent}`;
	const css = {
		width: `${segment.percent}%`,
		backgroundColor: segment.color,
	};
	return <div className={styles.SegmentItem} style={css} title={title}></div>;
};

const SegmentsLegend = ({ segments }: { segments: Segment[] }) => {
	return (
		<div className={styles.SegmentsLegend}>
			{segments.map((item, idx) => {
				const css = { backgroundColor: item.color };

				return (
					<div key={idx} className={styles.SegmentsLegend_item}>
						<div className={styles.SegmentsLegend_item_badge} style={css}></div>
						<div className={styles.SegmentsLegend_item_label}>{item.label}</div>
					</div>
				);
			})}
		</div>
	);
};

// When there are more than 4 segments, hide the label
// and show the legend only...this prevents overflow & misalignment of the segments' legend
const hasOverflow = (segments: Segment[]) => {
	return segments.length > 4;
};

const ActivitySegments = ({ label = "Breakdown", segments }: Props) => {
	const hideLabel = hasOverflow(segments);
	return (
		<div className={styles.ActivitySegments}>
			<div className={styles.ActivitySegments_header}>
				<div className={styles.ActivitySegments_header_label}>
					{!hideLabel && label}
				</div>
				<div className={styles.ActivitySegments_legend}>
					<SegmentsLegend segments={segments} />
				</div>
			</div>
			<div className={styles.ActivitySegments_segments}>
				{segments.map((segment, idx) => {
					const key = `${segment.label}-${idx}`;
					return <SegmentItem key={key} segment={segment} />;
				})}
			</div>
		</div>
	);
};

export default ActivitySegments;
