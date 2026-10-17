import styles from "../../css/trends-details/TrendInsightsList.module.scss";
import { TrendInsight } from "../../features/trends-hub/types";
import { getToneStyles } from "../../utils/utils_trendsHub";

type Props = {
	insights: TrendInsight[];
};

// A category's insights, each marked with a dot in its tone's color
const TrendInsightsList = ({ insights }: Props) => {
	if (!insights.length) return null;

	return (
		<section className={styles.TrendInsightsList}>
			<h3 className={styles.TrendInsightsList_title}>Insights</h3>
			<ul className={styles.TrendInsightsList_list}>
				{insights.map((insight) => (
					<li
						key={insight.key}
						className={styles.Insight}
						style={getToneStyles(insight.tone)}
					>
						<span className={styles.Insight_dot} aria-hidden="true" />
						<span className={styles.Insight_text}>{insight.text}</span>
					</li>
				))}
			</ul>
		</section>
	);
};

export default TrendInsightsList;
