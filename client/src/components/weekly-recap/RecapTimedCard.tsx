import styles from "../../css/weekly-recap/RecapTimedCard.module.scss";
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

const TIMED_COLOR = "var(--timedAccent)";

const RecapTimedCard = ({ data, isActive = false }: Props) => {
	const { activities } = data.currentWeek;
	const { totalMins, totalWorkouts, longestMins } =
		activities.Timed as WeeklyRecapForActivity;
	const duration = durationTo(totalMins, "h&m");
	const longest = durationTo(longestMins, "h&m");
	const recapBars = getRecapProgressBars(data, "Timed");

	const header = (
		<>
			<h2 className={styles.Title}>
				You did <b>{duration}</b> of timed activities across{" "}
				<b>{totalWorkouts} total workouts</b>.
			</h2>
			<h6 className={styles.Desc}>Your longest session was {longest}.</h6>
		</>
	);
	const body = (
		<>
			{isActive && (
				<RecapProgressBars
					key="TIMED_PROGRESS"
					data={recapBars}
					color={TIMED_COLOR}
				/>
			)}
		</>
	);

	return (
		<RecapCard
			isActive={isActive}
			header={header}
			body={body}
			icon="timer"
			color={TIMED_COLOR}
		/>
	);
};

export default RecapTimedCard;
