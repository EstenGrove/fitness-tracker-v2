import styles from "../../css/trends-details/TrendKpiGrid.module.scss";
import { TrendKpi } from "../../features/trends-hub/types";
import { formatTrendValue } from "../../utils/utils_trendsHub";
import TrendChangePill from "../trends-hub/TrendChangePill";

type Props = {
	kpis: TrendKpi[];
};

const KpiTile = ({ kpi }: { kpi: TrendKpi }) => {
	return (
		<div className={styles.KpiTile}>
			<span className={styles.KpiTile_label}>{kpi.label}</span>
			<span className={styles.KpiTile_value}>
				{formatTrendValue(kpi.value, kpi.unit)}
			</span>
			<TrendChangePill kpi={kpi} />
		</div>
	);
};

// All of a category's KPIs, 2 per row
const TrendKpiGrid = ({ kpis }: Props) => {
	return (
		<div className={styles.TrendKpiGrid}>
			{kpis.map((kpi) => (
				<KpiTile key={kpi.key} kpi={kpi} />
			))}
		</div>
	);
};

export default TrendKpiGrid;
