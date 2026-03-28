import styles from "../../css/awards/StreakDetails.module.scss";
import { StreakAward } from "../../features/awards/types";
import StreakFlame from "../streaks/StreakFlame";
import { format } from "date-fns";

type Props = {
	streak: StreakAward;
};

const AchievedDate = ({ date }: { date: string | null }) => {
	if (!date) {
		return (
			<div className={styles.NotAchieved}>
				<span>Streak has NOT been achieved yet!</span>
			</div>
		);
	}
	const achievedOn = format(date, "EEE, MMM do yyyy");
	return (
		<div className={styles.AchievedDate}>
			<span>You achieved this streak on</span>
			<b>{achievedOn}</b>
		</div>
	);
};

const StreakInfo = ({ streak }: { streak: StreakAward }) => {
	const desc = streak.streakDesc;
	return (
		<div className={styles.StreakInfo}>Earned when {desc.toLowerCase()}</div>
	);
};

const StreakProgress = ({ streak }: { streak: StreakAward }) => {
	const progress = streak.wasAchieved ? streak.targetDays : streak.maxStreak;
	const outOf = `${progress}/${streak.targetDays}`;

	return (
		<div className={styles.StreakProgress}>
			<div className={styles.StreakProgress_outOf}>{outOf} days</div>
		</div>
	);
};

const StreakDetails = ({ streak }: Props) => {
	return (
		<div className={styles.StreakDetails}>
			<div className={styles.StreakDetails_main}>
				<div className={styles.StreakDetails_main_flame}>
					<StreakFlame size="XXLG" streak={Number(streak.targetDays)} />
				</div>
				<AchievedDate date={streak.achievedOn} />
				<StreakProgress streak={streak} />
				<StreakInfo streak={streak} />
			</div>
		</div>
	);
};

export default StreakDetails;
