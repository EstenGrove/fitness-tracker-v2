import sprite from "../../assets/icons/main.svg";
import styles from "../../css/activity/TypeBadge.module.scss";
import { Activity } from "../../features/shared/types";
import { getActivityStyles } from "../../utils/utils_activity";

type Props = {
	activityType: Activity;
};

const TypeBadge = ({ activityType }: Props) => {
	const { icon, color, bg } = getActivityStyles(activityType);
	const iconCSS = { fill: color };
	const bgCSS = { backgroundColor: bg };
	return (
		<div className={styles.TypeBadge} style={bgCSS}>
			<svg className={styles.TypeBadge_icon} style={iconCSS}>
				<use xlinkHref={`${sprite}#icon-${icon}`} />
			</svg>
		</div>
	);
};

export default TypeBadge;
