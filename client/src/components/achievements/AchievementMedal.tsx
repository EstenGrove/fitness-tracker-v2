import sprite from "../../assets/icons/habits.svg";
import styles from "../../css/achievements/AchievementMedal.module.scss";
import { awardIcons } from "../../utils/utils_achievements";

const medalIcons = awardIcons.medals;

type Size = "XSM" | "SM" | "MD" | "LG" | "XLG";

type Props = {
	icon: keyof typeof medalIcons;
	color?: string;
	text?: string;
	size?: Size;
};

const getClasses = (size: Size) => {
	const classes = [styles.AchievementStreak, styles[size]].join(" ");
	return classes;
};

const AchievementMedal = ({
	icon,
	color = "var(--accent-orange)",
	text,
	size = "XSM",
}: Props) => {
	const css = { fill: color };
	const iconName = medalIcons[icon];
	const classes = getClasses(size);
	return (
		<div className={classes}>
			<svg className={styles.AchievementMedal_icon} style={css}>
				<use xlinkHref={`${sprite}#icon-${iconName}`}></use>
				{!!text && <span>{text}</span>}
			</svg>
		</div>
	);
};

export default AchievementMedal;
