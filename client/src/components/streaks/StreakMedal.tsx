import styles from "../../css/streaks/StreakMedal.module.scss";
import { StreakColor, StreakSize } from "../../utils/utils_streaks";

type Size = StreakSize;
type Color = StreakColor;

type Props = {
	size?: Size;
	color?: Color;
	streak: number;
	label?: string;
};

const StreakMedal = ({
	size = "MD",
	color = "gold",
	streak,
	label = "Day Streak",
}: Props) => {
	return (
		<div className={`${styles.Medal} ${styles[size]} ${styles[color]}`}>
			<div className={styles.Medal_inner}>
				<span className={styles.Medal_count}>{streak}</span>
				<span className={styles.Medal_label}>{label}</span>
			</div>
		</div>
	);
};

export default StreakMedal;
