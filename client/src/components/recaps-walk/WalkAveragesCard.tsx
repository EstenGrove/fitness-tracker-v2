import styles from "../../css/recaps-walk/WalkAveragesCard.module.scss";
import { WalkRecapDetails } from "../../features/workout-recaps/types";
import { getDaysRange } from "../../utils/utils_recaps";
import { formatThousand } from "../../utils/utils_misc";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsBody from "../recaps-carousel/RecapsBody";
import MetricTrend from "../recaps-shared/MetricTrend";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapChart from "../recaps-shared/RecapChart";

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

const getMilesData = (data: WalkRecapDetails) => {
	if (!data) return [];

	const miles = data.history.map((entry) => {
		return entry.totalMiles;
	});
	return miles;
};

const showMetrics = true;
const showChart = true;

const WalkAveragesCard = ({ isActive, data }: Props) => {
	const days = getDaysRange(data);
	const trends = getOverallTrend(data);
	const milesData = getMilesData(data);
	const avgMiles = getAvg(data.recap.avgMiles);
	const avgSteps = getAvg(data.recap.avgSteps);
	const maxMiles = getAvg(data.recap.maxMiles);
	const maxSteps = getAvg(data.recap.maxSteps);

	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					Your walking distance is trending{" "}
					<b data-direction={trends.direction}>{trends.direction}</b> in the
					last <b>{days}</b> days.
				</h2>
				<h6 className={styles.Desc}>
					Your longest walk was {maxMiles} miles ({maxSteps} steps)
				</h6>
			</RecapsHeader>
			<RecapsBody>
				{showMetrics && (
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
					</div>
				)}
				{showChart && (
					<div className={styles.Chart}>
						<RecapChart
							icon="steps"
							data={milesData}
							label="Distance (mi.)"
							chartStroke="var(--walkAccent)"
							chartFill="var(--walkFill)"
							titlePosition="bottom"
						/>
					</div>
				)}
			</RecapsBody>
		</RecapsCard>
	);
};

export default WalkAveragesCard;
