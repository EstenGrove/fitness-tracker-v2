import styles from "../../css/details/WalkDetails.module.scss";
import { WalkWorkout } from "../../features/workouts/types";
import { WalkHistory } from "../../features/history/types";
import { formatThousand } from "../../utils/utils_misc";
import DetailsBlock from "./DetailsBlock";
import { getKcals } from "../../utils/utils_history";

type Props = { entry: WalkWorkout | WalkHistory };

const WalkDetails = ({ entry }: Props) => {
	const { steps = 0, miles = 0, pace = 0, duration } = entry;
	const mins = duration + ":00";
	const kcals = getKcals(entry);
	const walkSteps = formatThousand(steps);
	const walkMiles = miles;
	const walkPace = pace + `'/sec`;
	return (
		<div className={styles.WalkDetails}>
			<div className={styles.WalkDetails_details}>
				<DetailsBlock type="Duration" label="Duration" value={mins} />
				<DetailsBlock type="Effort" label="Effort" value="Moderate" />
				<DetailsBlock type="Calories" label="Calories" value={kcals} />
				<DetailsBlock type="Steps" label="Steps" value={walkSteps} />
				<DetailsBlock type="Miles" label="Miles" value={walkMiles} />
				<DetailsBlock type="Pace" label="Pace" value={walkPace} />
			</div>
		</div>
	);
};

export default WalkDetails;
