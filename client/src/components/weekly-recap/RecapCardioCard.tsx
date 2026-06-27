import styles from "../../css/weekly-recap/RecapCardioCard.module.scss";
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

const CARDIO_COLOR = "var(--cardioAccent)";

const RecapCardioCard = ({ data, isActive = false }: Props) => {
	const { activities } = data.currentWeek;
	const { totalMins, totalWorkouts, longestMins } =
		activities.Cardio as WeeklyRecapForActivity;
	const duration = durationTo(totalMins, "h&m");
	const longest = durationTo(longestMins, "h&m");
	const recapBars = getRecapProgressBars(data, "Cardio");

	const header = (
		<>
			<h2 className={styles.Title}>
				You did <b>{duration}</b> of cardio across{" "}
				<b>{totalWorkouts} total workouts</b>.
			</h2>
			<h6 className={styles.Desc}>Your longest session was {longest}.</h6>
		</>
	);
	const body = (
		<>
			{isActive && (
				<RecapProgressBars
					key="CARDIO_PROGRESS"
					data={recapBars}
					color={CARDIO_COLOR}
				/>
			)}
		</>
	);

	return (
		<RecapCard
			isActive={isActive}
			header={header}
			body={body}
			icon="cardio2"
			color={CARDIO_COLOR}
		/>
	);
};

export default RecapCardioCard;
