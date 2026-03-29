import styles from "../../css/achievements/AchievementBadge.module.scss";
import { StreakColor, StreakSize } from "../../utils/utils_streaks";
import { addEllipsis } from "../../utils/utils_misc";

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
	const classes = [
		styles.AchievementBadge,
		styles[size],
		styles[color],
		variant ? styles[variant] : null,
	]
		.filter(Boolean)
		.join(" ");

	const cleanTitle = addEllipsis(title, 5);
	return (
		<div className={classes}>
			<div className={styles.AchievementBadge_inner}>
				<span className={styles.AchievementBadge_count}>{cleanTitle}</span>
				<span className={styles.AchievementBadge_label}>{label}</span>
			</div>
		</div>
	);
};

export default AchievementBadge;
