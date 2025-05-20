import sprite from "../../assets/icons/habits.svg";
import styles from "../../css/achievements/AchievementStreak.module.scss";
import { awardIcons } from "../../utils/utils_achievements";

const streakIcons = awardIcons.streaks;

type Size = "XSM" | "SM" | "MD" | "LG" | "XLG";

type Props = {
	icon: keyof typeof streakIcons;
	color?: string;
	text?: string;
	size?: Size;
};

const getClasses = (size: Size) => {
	const classes = [styles.AchievementStreak, styles[size]].join(" ");
	return classes;
};

const AchievementStreak = ({
	icon,
	color = "var(--accent-orange)",
	text,
	size = "XSM",
}: Props) => {
	const css = { fill: color };
	const iconName = streakIcons[icon];
	const classes = getClasses(size);
	return (
		<div className={classes}>
			<svg className={styles.AchievementStreak_icon} style={css}>
				<use xlinkHref={`${sprite}#icon-${iconName}`}></use>
				{!!text && <span>{text}</span>}
			</svg>
		</div>
	);
};

export default AchievementStreak;
