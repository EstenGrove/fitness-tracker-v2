import styles from "../../css/recaps-shared/TotalsCard.module.scss";
import { ActivityRecapDetails } from "../../features/workout-recaps/types";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";
import AreaChart from "../ui/AreaChart";
import { Activity } from "../../features/shared/types";

type Props = {
	isActive: boolean;
	data: ActivityRecapDetails;
	lastXDays?: number;
	activityType: Activity;
};

const colorsByActivity = {
	Strength: {
		fill: "var(--strengthFill)",
		stroke: "var(--strengthAccent)",
	},
	Walk: {
		fill: "var(-walkFill)",
		stroke: "var(-walkAccent)",
	},
	Stretch: {
		fill: "var(--stretchFill)",
		stroke: "var(--stretchAccent)",
	},
	Cardio: {
		fill: "var(--cardioFill)",
		stroke: "var(--cardioAccent)",
	},
	Timed: {
		fill: "var(--timedFill)",
		stroke: "var(--timedAccent)",
	},
	Other: {
		fill: "var(--otherFill)",
		stroke: "var(--otherAccent)",
	},
};

const getTotalsData = (data: ActivityRecapDetails) => {
	if (!data || !data.history.length) return [];
	return data.history.map((entry) => entry.totalMins);
};

const TotalsCard = ({
	isActive,
	lastXDays = 30,
	data,
	activityType,
}: Props) => {
	const delta = { direction: "flat", delta: 0 };
	const totalsData: number[] = getTotalsData(data);
	const colors = colorsByActivity[activityType];
	const totals = {
		totalMins: data?.recap?.totalMins,
		totalWorkouts: data?.recap?.totalWorkouts,
	};
	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					You did <b>{totals.totalMins}</b> of walking across{" "}
					<b>{totals.totalWorkouts} workouts.</b>
				</h2>
				<div className={styles.Desc}>
					You performed {totals.totalWorkouts} in the last {lastXDays} days.
				</div>
			</RecapsHeader>
			<RecapsBody>
				<div className={styles.Chart}>
					<AreaChart
						data={totalsData}
						fill={colors.fill}
						stroke={colors.stroke}
						heightRatio={0.4}
					/>
				</div>
				<div className={styles.Delta}>
					Your workout time is {delta.direction} by {delta.delta}%
				</div>
			</RecapsBody>
		</RecapsCard>
	);
};

export default TotalsCard;
