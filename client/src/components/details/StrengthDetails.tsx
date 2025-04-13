import styles from "../../css/details/StrengthDetails.module.scss";
import { StrengthHistory } from "../../features/history/types";
import { StrengthWorkout } from "../../features/workouts/types";
import { getKcals } from "../../utils/utils_history";
import DetailsBlock from "./DetailsBlock";

type Props = { entry: StrengthWorkout | StrengthHistory };

const formatDuration = (duration: number) => {
	const secs = ":00";
	const time = duration + secs;

	return time;
};

const getReps = (entry: StrengthHistory | StrengthWorkout) => {
	if ("historyID" in entry) {
		// history record
		const record = entry as StrengthHistory;
		const reps = record.sets.reduce((total, item) => (total += item.reps), 0);
		return reps + "reps";
	} else {
		// workout
		const record = entry as StrengthWorkout;
		return record.reps + "reps/set";
	}
};
const getSets = (entry: StrengthHistory | StrengthWorkout) => {
	if ("historyID" in entry) {
		// history record
		const record = entry as StrengthHistory;
		const sets = record.sets.length || 0;
		return sets;
	} else {
		// workout
		const record = entry as StrengthWorkout;
		return record.sets;
	}
};
const getWeight = (entry: StrengthHistory | StrengthWorkout) => {
	if ("historyID" in entry) {
		// history record
		const record = entry as StrengthHistory;
		const weight = record.sets.reduce(
			(total, item) => (total = item.weight > total ? item.weight : total),
			0
		);
		return weight + "lbs.";
	} else {
		// workout
		const record = entry as StrengthWorkout;
		return record.weight + "lbs.";
	}
};

const StrengthDetails = ({ entry }: Props) => {
	const { duration } = entry;
	const kcals = getKcals(entry);
	const reps = getReps(entry);
	const sets = getSets(entry);
	const weight = getWeight(entry);
	const mins = formatDuration(duration);
	return (
		<div className={styles.StrengthDetails}>
			<div className={styles.StrengthDetails_title}>Workout Details:</div>
			<div className={styles.StrengthDetails_details}>
				<DetailsBlock type="Duration" label="Duration" value={mins} />
				<DetailsBlock type="Effort" label="Effort" value="Moderate" />
				<DetailsBlock type="Calories" label="Calories" value={kcals} />
				<DetailsBlock type="Reps" label="Reps" value={reps} />
				<DetailsBlock type="Sets" label="Sets" value={sets + " sets"} />
				<DetailsBlock type="Weight" label="Weight" value={weight} />
			</div>
		</div>
	);
};

export default StrengthDetails;
