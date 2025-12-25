import styles from "../../css/awards/StreaksSummary.module.scss";
import StreakFlame from "../streaks/StreakFlame";
import {
	HabitStreakDetails,
	WorkoutStreakDetails,
} from "../../features/streaks/types";

type Props = {
	streaks: WorkoutStreakDetails | HabitStreakDetails;
};

type StreakItemProps = {
	label: string;
	value: number | string;
};

const StreakItem = ({ label, value }: StreakItemProps) => {
	return (
		<div className={styles.StreakItem}>
			<div className={styles.StreakItem_flame}>
				<StreakFlame streak={Number(value)} size="XLG" />
			</div>
			<div className={styles.StreakItem_details}>
				<div className={styles.StreakItem_details_label}>{label}</div>
				<div className={styles.StreakItem_details_streak}>
					<b>{value}</b> days
				</div>
			</div>
		</div>
	);
};

const StreaksSummary = ({ streaks }: Props) => {
	const { currentStreak: current, longestStreak: longest } = streaks;
	const currentStreak = current.currentStreak;
	const longestStreak = longest.longestStreak;
	return (
		<div className={styles.StreaksSummary}>
			<StreakItem label="Current Streak" value={currentStreak} />
			<StreakItem label="Longest Streak" value={longestStreak} />
		</div>
	);
};

export default StreaksSummary;
