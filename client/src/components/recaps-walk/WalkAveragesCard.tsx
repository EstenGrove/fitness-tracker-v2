import React from "react";
import styles from "../../css/recaps-walk/WalkAveragesCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";
import { WalkRecapDetails } from "../../features/workout-recaps/types";
import { getDaysRange, getLongestMins } from "../../utils/utils_recaps";
import { TrendMetric, WalkTrends } from "../../features/trends/types";
import { durationTo } from "../../utils/utils_workouts";
import { formatThousand } from "../../utils/utils_misc";
import MetricAvg from "../recaps-shared/MetricAvg";
import MetricTrend from "../recaps-shared/MetricTrend";

type Props = { isActive: boolean; data: WalkRecapDetails };

const getOverallTrend = (data: WalkRecapDetails) => {
	if (!data) return { delta: 0, direction: "flat" };
	const minsTrend = data.trends.mins;
	return minsTrend;
};

const getAvg = (value: number) => {
	if (value >= 1000) {
		return formatThousand(value);
	} else {
		return value.toFixed(2);
	}
};

const WalkAveragesCard = ({ isActive, data }: Props) => {
	const days = getDaysRange(data);
	const trends = getOverallTrend(data);
	const longest = getLongestMins(data);
	const avgMins = getAvg(data.recap.avgMins);
	const avgMiles = getAvg(data.recap.avgMiles);
	const avgSteps = getAvg(data.recap.avgSteps);

	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					Your walks are trending{" "}
					<b data-direction={trends.direction}>{trends.direction}</b> in the
					last <b>{days}</b> days.
				</h2>
				<h6 className={styles.Desc}>
					Your longest walk was {durationTo(longest, "h&m")}.
				</h6>
			</RecapsHeader>
			<RecapsBody>
				<div className={styles.Metrics}>
					<MetricTrend
						title="Miles"
						type="miles"
						value={avgMiles}
						direction="down"
						delta={32.0}
					/>
					<MetricTrend
						title="Steps"
						type="steps"
						value={avgSteps}
						direction="up"
						delta={6.52}
					/>
					{/* <MetricTrend
						title="Reps"
						type="reps"
						value={32}
						direction="flat"
						delta={0}
					/>
					<MetricTrend
						title="Volume"
						type="volume"
						value={1850}
						direction="up"
						delta={66.2}
					/> */}
				</div>

				{/*  */}
				{/*  */}
			</RecapsBody>
		</RecapsCard>
	);
};

export default WalkAveragesCard;
