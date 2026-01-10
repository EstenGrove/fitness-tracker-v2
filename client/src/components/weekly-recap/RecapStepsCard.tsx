import styles from "../../css/weekly-recap/RecapStepsCard.module.scss";
import {
	WeeklyRecapForWalkActivity,
	WeeklyRecaps,
} from "../../features/recaps/types";
import { durationTo } from "../../utils/utils_workouts";
import { formatThousand } from "../../utils/utils_misc";
import RecapCard from "./RecapCard";

type Props = {
	isActive: boolean;
	data: WeeklyRecaps;
};

const RecapStepsCard = ({ data, isActive = false }: Props) => {
	const { activities } = data.currentWeek;
	const { totalMins, totalMiles, totalSteps, totalWorkouts } =
		activities.Walk as WeeklyRecapForWalkActivity;
	const duration = durationTo(totalMins, "h&m");
	const miles = `${totalMiles.toFixed(2)} mi`;
	const steps = formatThousand(totalSteps);

	const header = (
		<>
			<h2 className={styles.Title}>
				You walked <b>{miles}</b> in <b>{duration}</b>.
			</h2>
			<h6 className={styles.Desc}>
				You walked {steps} steps across {totalWorkouts} total workouts.
			</h6>
		</>
	);
	const body = (
		<>
			{/*  */}
			{/*  */}
		</>
	);

	return (
		<RecapCard
			isActive={isActive}
			header={header}
			body={body}
			icon="steps"
			color="var(--accent-green)"
		/>
	);
};

export default RecapStepsCard;
