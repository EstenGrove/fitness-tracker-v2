import styles from "../../css/recaps-strength/StrengthTotalsCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import { StrengthRecapDetails } from "../../features/workout-recaps/types";
import { durationTo } from "../../utils/utils_workouts";
import RecapsBody from "../recaps-carousel/RecapsBody";
import { formatThousand } from "../../utils/utils_misc";
import AreaChart from "../ui/AreaChart";
import WorkoutTime from "../recaps-shared/WorkoutTime";
import { TrendMetric } from "../../features/trends/types";

type Props = {
	isActive: boolean;
	data: StrengthRecapDetails;
};

// Total Volume:
// Total Mins/Time
// Total Reps
// ...'Across X workouts'

const getTotals = (data: StrengthRecapDetails) => {
	if (!data) {
		return {
			totalMins: 0,
			totalReps: 0,
			totalVolume: 0,
			totalWorkouts: 0,
		};
	}
	const mins = data?.recap?.totalMins ?? 0;
	const totalMins = durationTo(mins, "h&m");

	const vol = formatThousand(data?.recap?.totalVolume);
	const totalVolume = vol;

	const reps = formatThousand(data?.recap?.totalReps);
	const totalReps = reps;

	const workouts = data?.recap?.totalWorkouts;
	const totalWorkouts = workouts;

	return {
		totalMins,
		totalReps,
		totalVolume,
		totalWorkouts,
	};
};

const getMinsDelta = (data: StrengthRecapDetails): TrendMetric => {
	if (!data) return { delta: 0, direction: "flat" };
	const trend = data?.trends?.mins;

	return {
		delta: trend.delta,
		direction: trend.direction,
	};
};

const getTotalsDataFor = (
	data: StrengthRecapDetails,
	forKey: "totalMins" | "totalCalories" | "totalReps" | "totalVolume"
): number[] => {
	if (!data || !data.history.length) return [];
	const totalsData = data.history.map((entry) => {
		return entry?.[forKey];
	});

	return totalsData;
};

const StrengthTotalsCard = ({ isActive, data }: Props) => {
	const totals = getTotals(data);
	const delta = getMinsDelta(data);
	const days = data?.trends?.rangeDays;
	const totalsData = getTotalsDataFor(data, "totalMins");

	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					You did <b>{totals.totalMins}</b> of strength training across{" "}
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
						fill="var(--strengthFill)"
						stroke="var(--strengthAccent)"
					/>
				</div>
				<div className={styles.Delta}>
					<WorkoutTime delta={delta.delta} direction={delta.direction} />
				</div>
			</RecapsBody>
		</RecapsCard>
	);
};

export default StrengthTotalsCard;
