import styles from "../../css/details/StrengthDetails.module.scss";
import { HistoryOfType, StrengthHistory } from "../../features/history/types";
import { StrengthWorkout } from "../../features/workouts/types";
import { getKcals } from "../../utils/utils_history";
import DetailsBlock from "./DetailsBlock";

type Entry = StrengthWorkout | StrengthHistory | HistoryOfType;

type Props = { entry: Entry };

const formatDuration = (duration: number) => {
	const secs = ":00";
	const time = duration + secs;

	return time;
};

const getWeight = (entry: Entry) => {
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

const getEffort = (entry: Entry) => {
	if ("effort" in entry) {
		return entry.effort;
	} else {
		return "Moderate";
	}
};

const StrengthDetails = ({ entry }: Props) => {
	const { duration } = entry;
	const kcals = getKcals(entry);
	const weight = getWeight(entry);
	const effort = getEffort(entry);
	const mins = formatDuration(duration);
	return (
		<div className={styles.StrengthDetails}>
			<div className={styles.StrengthDetails_details}>
				<DetailsBlock type="Duration" label="Duration" value={mins} />
				<DetailsBlock type="Effort" label="Effort" value={effort} />
				<DetailsBlock type="Calories" label="Calories" value={kcals} />
				<DetailsBlock type="Weight" label="Weight" value={weight} />
			</div>
		</div>
	);
};

export default StrengthDetails;
