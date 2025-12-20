import styles from "../../css/streaks/StreakMedal.module.scss";
import { StreakColor, StreakSize } from "../../utils/utils_streaks";

type Size = StreakSize;
type Color = StreakColor;
type Variant = "inferno" | "mythic" | "ascended";

type Props = {
	size?: Size;
	color?: Color;
	variant?: Variant;
	streak: number;
	label?: string;
};

const StreakMedal = ({
	size = "MD",
	color = "gold",
	streak = 0,
	label = "Day Streak",
	variant,
}: Props) => {
	const classes = [
		styles.Medal,
		styles[size],
		styles[color],
		variant && styles[variant],
	].join(" ");
	return (
		<div className={classes}>
			<div className={styles.Medal_inner}>
				<span className={styles.Medal_count}>{streak}</span>
				<span className={styles.Medal_label}>{label}</span>
			</div>
		</div>
	);
};

export default StreakMedal;
