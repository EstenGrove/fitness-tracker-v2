import styles from "../../css/weekly-recap/RecapStreakCard.module.scss";
import { CurrentStreak, LongestStreak } from "../../features/streaks/types";
import RecapCard from "./RecapCard";

interface StreakData {
	current: CurrentStreak;
	longest: LongestStreak;
}

type Props = {
	isActive: boolean;
	data: StreakData;
};

const hasStreak = (data: StreakData) => {
	const { current } = data;

	return current.currentStreak > 1;
};

const getTitle = (data: StreakData) => {
	const { current, longest } = data;
	const streakExists = hasStreak(data);

	if (current.currentStreak > 1) {
		return {
			current: current.currentStreak,
			longest: longest.longestStreak,
		};
	} else {
		return {
			current: current.currentStreak,
		};
	}
};

const RecapStreakCard = ({ isActive = false, data }: Props) => {
	const { current, longest } = data;
	const streakExists = hasStreak(data);
	const header = (
		<>
			{streakExists && (
				<>
					<h2 className={styles.Title}>
						Your streak is at <b>{current.currentStreak} days</b> so far. Keep
						pushing!
					</h2>
					<h6 className={styles.Desc}>
						Your longest streak to date is {longest.longestStreak} days.
					</h6>
				</>
			)}
			{!streakExists && (
				<>
					<h2 className={styles.Title}>
						Let's get a fresh start on your workout streak!
					</h2>
					<h6 className={styles.Desc}>
						Your longest streak to date is {longest.longestStreak} days.
					</h6>
				</>
			)}
			{/*  */}
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
			icon="speedometer"
			color="var(--accent)"
		/>
	);
};

export default RecapStreakCard;
