import styles from "../../css/weekly-recap/RecapOtherCard.module.scss";
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

const OTHER_COLOR = "var(--otherAccent)";

const RecapOtherCard = ({ data, isActive = false }: Props) => {
	const { activities } = data.currentWeek;
	const { totalMins, totalWorkouts, longestMins } =
		activities.Other as WeeklyRecapForActivity;
	const duration = durationTo(totalMins, "h&m");
	const longest = durationTo(longestMins, "h&m");
	const recapBars = getRecapProgressBars(data, "Other");

	const header = (
		<>
			<h2 className={styles.Title}>
				You did <b>{duration}</b> of other activities across{" "}
				<b>{totalWorkouts} total workouts</b>.
			</h2>
			<h6 className={styles.Desc}>Your longest session was {longest}.</h6>
		</>
	);
	const body = (
		<>
			{isActive && (
				<RecapProgressBars
					key="OTHER_PROGRESS"
					data={recapBars}
					color={OTHER_COLOR}
				/>
			)}
		</>
	);

	return (
		<RecapCard
			isActive={isActive}
			header={header}
			body={body}
			icon="exercise"
			color={OTHER_COLOR}
		/>
	);
};

export default RecapOtherCard;
