import styles from "../../css/recaps-cardio/CardioTotalsCard.module.scss";
import { CardioRecapDetails } from "../../features/workout-recaps/types";
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
	data: CardioRecapDetails;
};

// Total Mins/Time
// Total Reps
// ...'Across X workouts'

const getTotals = (data: CardioRecapDetails) => {
	if (!data) {
		return {
			totalMins: 0,
			totalReps: 0,
			totalWorkouts: 0,
		};
	}
	const mins = data?.recap?.totalMins ?? 0;
	const totalMins = durationTo(mins, "h&m");

	const reps = formatThousand(data?.recap?.totalReps);
	const totalReps = reps;

	const workouts = data?.recap?.totalWorkouts;
	const totalWorkouts = workouts;

	return {
		totalMins,
		totalReps,
		totalWorkouts,
	};
};

const getMinsDelta = (data: CardioRecapDetails): TrendMetric => {
	if (!data) return { delta: 0, direction: "flat" };
	const trend = data?.trends?.mins;

	return {
		delta: trend.delta,
		direction: trend.direction,
	};
};

const getTotalsDataFor = (
	data: CardioRecapDetails,
	forKey: "totalMins" | "totalCalories" | "totalReps"
): number[] => {
	if (!data || !data.history.length) return [];
	const totalsData = data.history.map((entry) => {
		return entry?.[forKey];
	});

	return totalsData;
};

const CardioTotalsCard = ({ isActive, data }: Props) => {
	const totals = getTotals(data);
	const delta = getMinsDelta(data);
	const days = data?.trends?.rangeDays;
	const totalsData = getTotalsDataFor(data, "totalMins");

	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					You did <b>{totals.totalMins}</b> of cardio across{" "}
					<b>{totals.totalWorkouts} workouts.</b>
				</h2>
				<div className={styles.Desc}>
					You performed {totals.totalWorkouts} workouts in the last {days} days.
				</div>
			</RecapsHeader>
			<RecapsBody>
				<div className={styles.Chart}>
					<AreaChart
						data={totalsData}
						fill="var(--cardioFill)"
						stroke="var(--cardioAccent)"
						heightRatio={0.4}
					/>
				</div>
				<div className={styles.Delta}>
					<WorkoutTime delta={delta.delta} direction={delta.direction} />
				</div>
			</RecapsBody>
		</RecapsCard>
	);
};

export default CardioTotalsCard;
