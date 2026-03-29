import styles from "../../css/achievements/AchievementBadge.module.scss";
import { StreakColor, StreakSize } from "../../utils/utils_streaks";

type Size = StreakSize;
type Color = StreakColor;
type Variant = "inferno" | "mythic" | "ascended";

type Props = {
	size?: Size;
	color?: Color;
	variant?: Variant;
	title: string;
	label?: string;
};

const AchievementBadge = ({
	size = "MD",
	color = "gold",
	title = "Award",
	label = "Achieved",
	variant,
}: Props) => {
	const innerClasses = [
		styles.AchievementBadge,
		styles[size],
		styles[color],
		variant ? styles[variant] : null,
	]
		.filter(Boolean)
		.join(" ");

	const glowClass =
		(styles[`glow_${color}` as keyof typeof styles] as string | undefined) ??
		styles.glow_gold;

	return (
		<div className={`${styles.AchievementBadge_glow} ${glowClass}`}>
			<div className={innerClasses}>
				<div className={styles.AchievementBadge_inner}>
					<span className={styles.AchievementBadge_count}>{title}</span>
					<span className={styles.AchievementBadge_label}>{label}</span>
				</div>
			</div>
		</div>
	);
};

export default AchievementBadge;
