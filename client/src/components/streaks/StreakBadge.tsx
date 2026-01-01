import styles from "../../css/streaks/StreakBadge.module.scss";

type Size = "XSM" | "SM" | "MD" | "LG" | "XLG";
type Color = "fire" | "gold" | "green" | "purple" | "pink" | "blue";

type Props = {
	size?: Size;
	color?: Color;
	streak: number;
	label?: string;
};

const StreakBadge = ({
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

export default StreakBadge;
