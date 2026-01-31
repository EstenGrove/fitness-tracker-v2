import styles from "../../css/recaps-stretch/StretchTotalsCard.module.scss";
import { StretchRecapDetails } from "../../features/workout-recaps/types";
import { durationTo } from "../../utils/utils_workouts";
import { formatThousand } from "../../utils/utils_misc";
import RecapsCard from "../recaps-carousel/RecapsCard";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";
import AreaChart from "../ui/AreaChart";
import WorkoutTime from "../recaps-shared/WorkoutTime";

type Props = {
	isActive: boolean;
	data: StretchRecapDetails;
};

// Total Mins/Time
// Total Reps
// ...'Across X workouts'

const getTotals = (data: StretchRecapDetails) => {
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

const getMinsDelta = (data: StretchRecapDetails) => {
	if (!data) return { delta: 0, direction: "flat" as "up" | "flat" | "down" };
	const trend = data?.trends?.mins;

	return {
		delta: trend.delta,
		direction: trend.direction as "up" | "flat" | "down",
	};
};

const getTotalsDataFor = (
	data: StretchRecapDetails,
	forKey: "totalMins" | "totalCalories" | "totalReps"
): number[] => {
	if (!data || !data.history.length) return [];
	const totalsData = data.history.map((entry) => {
		return entry?.[forKey];
	});

	return totalsData;
};

const StretchTotalsCard = ({ isActive, data }: Props) => {
	const totals = getTotals(data);
	const delta = getMinsDelta(data);
	const days = data?.trends?.rangeDays;
	const totalsData = getTotalsDataFor(data, "totalMins");

	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					You did <b>{totals.totalMins}</b> of stretching across{" "}
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
						fill="var(--stretchFill)"
						stroke="var(--stretchAccent)"
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

export default StretchTotalsCard;
