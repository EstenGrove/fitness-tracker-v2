import styles from "../../css/recaps-cardio/CardioAveragesCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";
import RecapChart from "../recaps-shared/RecapChart";
import { CardioRecapDetails } from "../../features/workout-recaps/types";
import { getDaysRange, getLongestMins } from "../../utils/utils_recaps";
import { durationTo } from "../../utils/utils_workouts";

type Props = {
	isActive: boolean;
	data: CardioRecapDetails;
};

const getOverallTrend = (data: CardioRecapDetails) => {
	if (!data) return { delta: 0, direction: "flat" };
	const minsTrend = data.trends.mins;
	return minsTrend;
};

const getChartData = (
	data: CardioRecapDetails,
	key: "totalMins" | "totalCalories" | "totalReps" | "totalSets"
) => {
	if (!data || !data.history.length) return [];
	const chartData = data.history.map((entry) => entry[key]);
	return chartData;
};

const CardioChart = ({
	data,
	type = "totalCalories",
}: {
	data: CardioRecapDetails;
	type: "totalMins" | "totalCalories" | "totalReps" | "totalSets";
}) => {
	const chartData = getChartData(data, type);
	return (
		<>
			{type === "totalReps" && (
				<RecapChart
					icon="cardio2"
					data={chartData}
					label="Reps"
					chartFill="var(--redBG)"
					chartStroke="var(--accent-red)"
					titlePosition="bottom"
				/>
			)}
			{type === "totalSets" && (
				<RecapChart
					icon="cardio3"
					data={chartData}
					label="Sets"
					chartFill="var(--greenBG)"
					chartStroke="var(--accent-green)"
					titlePosition="bottom"
				/>
			)}
			{type === "totalCalories" && (
				<RecapChart
					icon="fire"
					data={chartData}
					label="Calories"
					chartFill="var(--cardioFill)"
					chartStroke="var(--cardioAccent)"
					titlePosition="bottom"
				/>
			)}
			{type === "totalMins" && (
				<RecapChart
					icon="cardio"
					data={chartData}
					label="Mins"
					chartFill="var(--cardioFill)"
					chartStroke="var(--cardioAccent)"
					titlePosition="bottom"
				/>
			)}
		</>
	);
};

const getTitleType = (
	type: "totalMins" | "totalCalories" | "totalReps" | "totalSets"
) => {
	switch (type) {
		case "totalMins":
			return "cardio time";
		case "totalCalories":
			return "calories (kcals)";
		case "totalReps":
			return "total reps";
		case "totalSets":
			return "total sets";
	}
};

const CardioAveragesCard = ({ isActive, data }: Props) => {
	const days = getDaysRange(data);
	const trend = getOverallTrend(data);
	const longest = getLongestMins(data);
	const titleType = getTitleType("totalCalories");
	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					Your <b>{titleType}</b> are trending{" "}
					<b data-direction={trend?.direction}>{trend?.direction}</b> in the
					last <b>{days}</b> days.
				</h2>
				<h6 className={styles.Desc}>
					Your longest workout was {durationTo(longest, "h&m")}.
				</h6>
			</RecapsHeader>
			<RecapsBody>
				<CardioChart data={data} type="totalCalories" />
			</RecapsBody>
		</RecapsCard>
	);
};

export default CardioAveragesCard;
