import styles from "../../css/weekly-recap/RecapStrengthCard.module.scss";
import {
	WeeklyRecapForActivity,
	WeeklyRecaps,
} from "../../features/recaps/types";
import { getRecapProgressBars } from "../../utils/utils_weeklyRecap";
import { durationTo } from "../../utils/utils_workouts";
import RecapCard from "./RecapCard";
import RecapProgressBars from "./RecapProgressBars";

type Props = {
	isActive: boolean;
	data: WeeklyRecaps;
};

const STRENGTH_COLOR = "var(--accent-purple)";

const RecapStrengthCard = ({ data, isActive = false }: Props) => {
	const { activities } = data.currentWeek;
	const { totalMins, totalWorkouts, longestMins } =
		activities.Strength as WeeklyRecapForActivity;
	const duration = durationTo(totalMins, "h&m");
	const longest = durationTo(longestMins, "h&m");
	const recapBars = getRecapProgressBars(data, "Strength");

	const header = (
		<>
			<h2 className={styles.Title}>
				You did <b>{duration}</b> of strength training across{" "}
				<b>{totalWorkouts} total workouts</b>.
			</h2>
			<h6 className={styles.Desc}>Your longest session was {longest}.</h6>
		</>
	);
	const body = (
		<>
			{isActive && (
				<RecapProgressBars
					key="STEPS_PROGRESS"
					data={recapBars}
					color={STRENGTH_COLOR}
				/>
			)}
		</>
	);

	return (
		<RecapCard
			isActive={isActive}
			header={header}
			body={body}
			icon="dumbbell2"
			color={STRENGTH_COLOR}
		/>
	);
};

export default RecapStrengthCard;
