import styles from "../../css/recaps-walk/WalkTotalsCard.module.scss";
import { WalkRecapDetails } from "../../features/workout-recaps/types";
import { durationTo } from "../../utils/utils_workouts";
import { formatThousand } from "../../utils/utils_misc";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";
import AreaChart from "../ui/AreaChart";
import WorkoutTime from "../recaps-shared/WorkoutTime";
import { TrendMetric } from "../../features/trends/types";

type Props = {
	isActive: boolean;
	data: WalkRecapDetails;
};

// Total Mins/Time
// Total Reps
// ...'Across X workouts'

const getTotals = (data: WalkRecapDetails) => {
	if (!data) {
		return {
			totalMins: 0,
			totalMiles: 0,
			totalWorkouts: 0,
		};
	}
	const mins = data?.recap?.totalMins ?? 0;
	const totalMins = durationTo(mins, "h&m");

	const reps = formatThousand(data?.recap?.totalMiles);
	const totalMiles = reps;

	const workouts = data?.recap?.totalWorkouts;
	const totalWorkouts = workouts;

	return {
		totalMins,
		totalMiles,
		totalWorkouts,
	};
};

const getMinsDelta = (data: WalkRecapDetails): TrendMetric => {
	if (!data) return { delta: 0, direction: "flat" };
	const trend = data?.trends?.mins;

	return {
		delta: trend.delta,
		direction: trend.direction,
	};
};

const getTotalsDataFor = (
	data: WalkRecapDetails,
	forKey: "totalMins" | "totalCalories" | "totalMiles"
): number[] => {
	if (!data || !data.history.length) return [];
	const totalsData = data.history.map((entry) => {
		return entry?.[forKey];
	});

	return totalsData || [];
};

const WalkTotalsCard = ({ isActive, data }: Props) => {
	const totals = getTotals(data);
	const delta = getMinsDelta(data);
	const days = data?.trends?.rangeDays;
	const totalsData = getTotalsDataFor(data, "totalMins");

	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					You did <b>{totals.totalMins}</b> of walking across{" "}
					<b>{totals.totalWorkouts} workouts.</b>
				</h2>
				<div className={styles.Desc}>
					You performed {totals.totalWorkouts} in the last {days} days.
				</div>
			</RecapsHeader>
			<RecapsBody>
				<div className={styles.Chart}>
					<AreaChart
						data={totalsData}
						fill="var(--walkFill)"
						stroke="var(--walkAccent)"
						heightRatio={0.4}
					/>
				</div>
				<div className={styles.Delta}>
					<WorkoutTime
						delta={delta.delta.toFixed(2)}
						direction={delta.direction}
					/>
				</div>
			</RecapsBody>
		</RecapsCard>
	);
};

export default WalkTotalsCard;
