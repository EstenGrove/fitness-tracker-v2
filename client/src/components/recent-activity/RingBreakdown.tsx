import styles from "../../css/recent-activity/RingBreakdown.module.scss";
import { Segment } from "../../features/recent-activity/types";
import { extractHrsAndMins } from "../../utils/utils_formatter";
import { addEllipsis } from "../../utils/utils_misc";
import RingSegments from "../ui/RingSegments";

type Props = { segments: Segment[] };

type SegmentLabelProps = {
	segment: Segment;
};

const getMinsAndHrs = (totalMins: number) => {
	const { hrs, mins } = extractHrsAndMins(totalMins);

	if (totalMins < 60) {
		return `${mins} min`;
	}

	return `${hrs} hr ${mins} min`;
};

const SegmentLabel = ({ segment }: SegmentLabelProps) => {
	const { mins, percent, label, color } = segment;
	const labelCss = { color };
	const normedLabel = addEllipsis(label, 8);
	const duration = getMinsAndHrs(mins);
	return (
		<div className={styles.SegmentLabel}>
			<div className={styles.SegmentLabel_percent}>
				<span>{percent}</span>
				<span>%</span>
			</div>
			<div className={styles.SegmentLabel_label} style={labelCss}>
				<span>{normedLabel}</span>
			</div>
			<div className={styles.SegmentLabel_mins}>
				<span>{duration}</span>
			</div>
		</div>
	);
};

const RingBreakdown = ({ segments }: Props) => {
	return (
		<div className={styles.RingBreakdown}>
			<div className={styles.RingBreakdown_values}>
				{segments.map((segment, idx) => {
					const key = `${segment.mins}-${idx}`;
					return <SegmentLabel key={key} segment={segment} />;
				})}
			</div>
			<div className={styles.RingBreakdown_display}>
				<RingSegments data={segments} />
			</div>
		</div>
	);
};

export default RingBreakdown;
