import styles from "../../css/details/TimedDetails.module.scss";
import { TimedWorkout } from "../../features/workouts/types";
import { TimedHistory } from "../../features/history/types";
import { getKcals } from "../../utils/utils_history";
import { formatDuration } from "../../utils/utils_details";
import DetailsBlock from "./DetailsBlock";

type Props = { entry: TimedWorkout | TimedHistory };

const TimedDetails = ({ entry }: Props) => {
	const { duration } = entry;
	const effort = "Easy";
	const kcals = getKcals(entry);
	const mins = formatDuration(duration);
	return (
		<div className={styles.StretchDetails}>
			<div className={styles.StretchDetails_main}>
				<DetailsBlock type="Duration" label="Duration" value={mins} />
				<DetailsBlock type="Effort" label="Effort" value={effort} />
				<DetailsBlock type="Calories" label="Calories" value={kcals} />
				<DetailsBlock type="WorkoutType" label="Exercise" value="Stretch" />
			</div>
		</div>
	);
};

export default TimedDetails;
