import styles from "../../css/trends-details/TrendBreakdownList.module.scss";
import {
	TrendBreakdown,
	TrendBreakdownItem,
} from "../../features/trends-hub/types";
import { formatTrendValue } from "../../utils/utils_trendsHub";

type Props = {
	breakdown: TrendBreakdown;
};

// Bar width: the item's share, its % value (eg. completion rates), or its value vs the largest item
const getBarWidth = (item: TrendBreakdownItem, maxValue: number) => {
	if (item.share !== null) return item.share;
	if (item.unit === "pct") return Math.min(item.value, 100);
	return maxValue ? (item.value / maxValue) * 100 : 0;
};

const BreakdownRow = ({
	item,
	maxValue,
}: {
	item: TrendBreakdownItem;
	maxValue: number;
}) => {
	const css = { width: `${getBarWidth(item, maxValue)}%` };
	const share = item.share !== null ? `${Math.round(item.share)}%` : null;

	return (
		<li className={styles.BreakdownRow}>
			<div className={styles.BreakdownRow_text}>
				<span className={styles.BreakdownRow_label}>{item.label}</span>
				<span className={styles.BreakdownRow_value}>
					{formatTrendValue(item.value, item.unit)}
					{share && <span className={styles.BreakdownRow_share}>{share}</span>}
				</span>
			</div>
			<div className={styles.BreakdownRow_track}>
				<span className={styles.BreakdownRow_bar} style={css} />
			</div>
		</li>
	);
};

// A labeled list with a bar per item, eg. minutes by activity, completion by workout
const TrendBreakdownList = ({ breakdown }: Props) => {
	if (!breakdown.items.length) return null;
	const maxValue = Math.max(...breakdown.items.map((item) => item.value));

	return (
		<section className={styles.TrendBreakdownList}>
			<h3 className={styles.TrendBreakdownList_title}>{breakdown.label}</h3>
			<ul className={styles.TrendBreakdownList_list}>
				{breakdown.items.map((item) => (
					<BreakdownRow key={item.key} item={item} maxValue={maxValue} />
				))}
			</ul>
		</section>
	);
};

export default TrendBreakdownList;
