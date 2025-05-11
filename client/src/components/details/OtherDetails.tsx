import styles from "../../css/details/OtherDetails.module.scss";
import { OtherWorkout } from "../../features/workouts/types";
import { OtherHistory } from "../../features/history/types";
import { getKcals } from "../../utils/utils_history";
import { formatDuration } from "../../utils/utils_details";
import DetailsBlock from "./DetailsBlock";

type Props = { entry: OtherWorkout | OtherHistory };

const OtherDetails = ({ entry }: Props) => {
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

export default OtherDetails;
