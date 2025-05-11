import styles from "../../css/details/CardioDetails.module.scss";
import { CardioWorkout } from "../../features/workouts/types";
import { CardioHistory } from "../../features/history/types";
import { getKcals } from "../../utils/utils_history";
import { formatDuration } from "../../utils/utils_details";
import DetailsBlock from "./DetailsBlock";

type Props = { entry: CardioWorkout | CardioHistory };

const CardioDetails = ({ entry }: Props) => {
	const { duration, reps } = entry;
	const mins = formatDuration(duration);
	const kcals = getKcals(entry);
	return (
		<div className={styles.CardioDetails}>
			<div className={styles.CardioDetails_details}>
				<DetailsBlock type="Duration" label="Duration" value={mins} />
				<DetailsBlock type="Effort" label="Effort" value="Moderate" />
				<DetailsBlock type="Calories" label="Calories" value={kcals} />
				<DetailsBlock type="Reps" label="Reps" value={reps} />
			</div>
		</div>
	);
};

export default CardioDetails;
