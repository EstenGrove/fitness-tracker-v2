import styles from "../../css/trends-hub/TrendChangePill.module.scss";
import { TrendKpi } from "../../features/trends-hub/types";
import { formatKpiChange, getToneStyles } from "../../utils/utils_trendsHub";

type Props = {
	kpi: TrendKpi;
};

// A KPI's change vs the prior period, eg. "−42%" or "+6 pts"; renders nothing without a prior period
const TrendChangePill = ({ kpi }: Props) => {
	const change = formatKpiChange(kpi);
	if (!change) return null;

	return (
		<span className={styles.TrendChangePill} style={getToneStyles(kpi.tone)}>
			{change}
		</span>
	);
};

export default TrendChangePill;
