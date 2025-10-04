import { useState } from "react";
import styles from "../../css/stats/MinsStats.module.scss";
import { RangeBy, TotalMinsBy } from "../../utils/utils_stats";
import { useTotalMins } from "../../hooks/useTotalMins";
import { formatDate } from "../../utils/utils_dates";
import StatsSummary from "../summary/StatsSummary";
import { StatsSummaryItem } from "../../features/stats/types";

type Props = {};

const MinsStats = ({}: Props) => {
	const base = formatDate(new Date(), "db");
	const [rangeType, setRangeType] = useState<RangeBy>("year");
	const { data, isLoading, refetch } = useTotalMins(base, rangeType);
	const summary = data as StatsSummaryItem[];

	console.log("data", data);

	return (
		<div className={styles.MinsStats}>
			{data && <StatsSummary summary={summary} />}
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default MinsStats;
