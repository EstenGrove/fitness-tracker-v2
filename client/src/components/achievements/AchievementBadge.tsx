import sprite from "../../assets/icons/habits.svg";
import styles from "../../css/achievements/AchievementBadge.module.scss";
import { awardIcons } from "../../utils/utils_achievements";

const badgeIcons = awardIcons.badges;

type Props = {
	icon: keyof typeof badgeIcons;
	color?: string;
	text?: string;
};

const AchievementBadge = ({
	icon,
	color = "var(--accent-orange)",
	text,
}: Props) => {
	const css = { fill: color };
	const iconName = badgeIcons[icon];
	return (
		<div className={styles.AchievementBadge}>
			<svg className={styles.AchievementBadge_icon} style={css}>
				<use xlinkHref={`${sprite}#icon-${iconName}`}></use>
				{!!text && <span>{text}</span>}
			</svg>
		</div>
	);
};

export default AchievementBadge;
