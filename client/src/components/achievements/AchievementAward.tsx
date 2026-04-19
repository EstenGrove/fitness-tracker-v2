import badgeGlow from "../../css/achievements/AchievementBadge.module.scss";
import styles from "../../css/achievements/AchievementAward.module.scss";
import { StreakColor, StreakSize } from "../../utils/utils_streaks";

type Size = StreakSize;

/** Streak palette (`StreakColor`) plus award-only shells; badges/medals still use `StreakColor` only. */
export type AchievementAwardColor =
	| StreakColor
	| "teal"
	| "orange"
	| "cyan"
	| "indigo"
	| "rose"
	| "bronze"
	| "slate";

type Color = AchievementAwardColor;
export type AchievementVariant = "inferno" | "mythic" | "ascended";

export type AchievementAwardShape = "circle" | "oval" | "medallion";

export type AchievementAwardProps = {
	size?: Size;
	color?: Color;
	variant?: AchievementVariant;
	shape?: AchievementAwardShape;
	title: string;
	label?: string;
	hasAchieved?: boolean;
};

const shapeClass: Record<AchievementAwardShape, string> = {
	circle: styles.AchievementAward_shape_circle,
	oval: styles.AchievementAward_shape_oval,
	medallion: styles.AchievementAward_shape_medallion,
};

const getStyles = (hasAchieved: boolean) => {
	if (hasAchieved) {
		return {
			opacity: "1",
		};
	}
	return {
		opacity: ".3",
	};
};

const AchievementAward = ({
	size = "MD",
	color = "gold",
	title = "Award",
	label = "Achieved",
	variant,
	shape = "circle",
	hasAchieved = true,
}: AchievementAwardProps) => {
	const css = getStyles(hasAchieved);
	const shellClasses = [
		styles.AchievementAward,
		shapeClass[shape],
		styles[size],
		styles[color],
		variant ? styles[variant] : null,
	]
		.filter(Boolean)
		.join(" ");

	const glowClass =
		(badgeGlow[`glow_${color}` as keyof typeof badgeGlow] as
			| string
			| undefined) ?? badgeGlow.glow_gold;

	const glowWrapClasses = [badgeGlow.AchievementBadge_glow, glowClass]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={glowWrapClasses} style={css}>
			<div className={shellClasses}>
				<div className={styles.AchievementAward_inner}>
					<span className={styles.AchievementAward_count}>{title}</span>
					<span className={styles.AchievementAward_label}>{label}</span>
				</div>
			</div>
		</div>
	);
};

export default AchievementAward;
