import styles from "../../css/recaps-strength/StrengthSetsCard.module.scss";
import RecapsCard from "../recaps-carousel/RecapsCard";
import { StrengthRecapDetails } from "../../features/workout-recaps/types";
import RecapsHeader from "../recaps-carousel/RecapsHeader";
import RecapsBody from "../recaps-carousel/RecapsBody";
import RecapDottedChart from "../recaps-shared/RecapDottedChart";

type Props = {
	isActive: boolean;
	data: StrengthRecapDetails;
};

const getRepsDataParts = (data: StrengthRecapDetails) => {
	if (!data || !data.history.length) {
		return { data: [], maxValue: 0, minValue: 0 };
	}
	const repsData: number[] = data.history.map((entry) => entry.totalReps);
	const min = Math.min(...repsData);
	const max = Math.max(...repsData);
	// We add 1/2 of the 'min' as an upper-bound cushion
	const normedMax = max + min / 2;

	return {
		data: repsData,
		minValue: min,
		maxValue: normedMax,
	};
};

const StrengthSetsCard = ({ isActive, data }: Props) => {
	const maxReps = data?.recap?.maxReps;
	const repsHistory = getRepsDataParts(data);
	const reps = data?.trends?.reps;
	const days = data?.trends?.rangeDays;

	console.log("Reps Data:", repsHistory);

	return (
		<RecapsCard isActive={isActive}>
			<RecapsHeader>
				<h2 className={styles.Title}>
					Your <b>strength reps</b> are trending <b>{reps?.direction}</b>!
				</h2>
				<div className={styles.Desc}>
					Your max reps in the last {days} days was {maxReps} reps in a set.
				</div>
			</RecapsHeader>
			<RecapsBody styles={{ justifyContent: "flex-end", paddingTop: "3rem" }}>
				<div className={styles.Charts}>
					<RecapDottedChart
						data={repsHistory.data}
						maxValue={repsHistory.maxValue}
						title="Total Reps per Workout"
						icon="weightLift"
						dotColor="var(--strengthAccent)"
						axisColor="var(--blueGrey400)"
					/>
				</div>
			</RecapsBody>
		</RecapsCard>
	);
};

export default StrengthSetsCard;
