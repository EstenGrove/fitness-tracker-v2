import {
	StrengthMetrics,
	StrengthSessionMetrics,
} from "../../features/metrics/types";
import styles from "../../css/metrics-cards/StrengthMetricsSummary.module.scss";
import MetricTrend from "../recaps-shared/MetricTrend";
import { getTrendSummary } from "../../utils/utils_trends";
import MetricAvg from "../recaps-shared/MetricAvg";

type Props = {
	data: StrengthMetrics;
};

const getRepsSummary = (data: StrengthMetrics) => {
	const { session, comparison } = data;

	const repsSummary = getTrendSummary(session.avgReps - comparison.deltaReps);
	return { value: session.avgReps, label: "avg reps", ...repsSummary };
};
const getSetsSummary = (data: StrengthMetrics) => {
	const { session, comparison } = data;

	const setsSummary = getTrendSummary(session.avgSets - comparison.deltaSets);
	return { value: session.avgSets, label: "avg sets", ...setsSummary };
};

const StrengthMetricsSummary = ({ data }: Props) => {
	const repsSummary = getRepsSummary(data);
	const setsSummary = getSetsSummary(data);
	return (
		<div className={styles.StrengthMetricsSummary}>
			<MetricAvg
				title="Avg. Reps"
				type="reps"
				value={repsSummary.value}
				label={"reps per set"}
				direction={repsSummary.direction}
				delta={repsSummary.delta}
			/>
			<MetricAvg
				title="Avg. Sets"
				type="sets"
				value={setsSummary.value}
				label={"sets per workout"}
				direction={setsSummary.direction}
				delta={setsSummary.delta}
			/>
		</div>
	);
};

export default StrengthMetricsSummary;
