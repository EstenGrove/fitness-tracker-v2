import { Segment } from "../../features/recent-activity/types";
import styles from "../../css/ui/RingSegments.module.scss";

type Props = {
	data: Segment[];
	size?: number;
	strokeWidth?: 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 55 | 60;
};

const RingSegments = ({ data = [], size = 120, strokeWidth = 15 }: Props) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	let offset = 0;

	return (
		<div className={styles.RingSegments}>
			<svg width={size} height={size} className={styles.RingSegments_svg}>
				<g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
					{data.map((segment, i) => {
						const length = (segment.percent / 100) * circumference;
						const dashArray = `${length} ${circumference - length}`;
						const segmentOffset = offset;
						offset += length;

						return (
							<circle
								key={i}
								cx={size / 2}
								cy={size / 2}
								r={radius}
								fill="none"
								stroke={segment.color}
								strokeWidth={strokeWidth}
								strokeDasharray={dashArray}
								strokeDashoffset={-segmentOffset}
								strokeLinecap="butt"
							/>
						);
					})}
				</g>
			</svg>
		</div>
	);
};

export default RingSegments;
