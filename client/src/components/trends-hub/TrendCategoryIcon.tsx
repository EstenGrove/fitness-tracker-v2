import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/trends-hub/TrendCategoryIcon.module.scss";
import { TrendTone } from "../../features/trends-hub/types";
import { getToneStyles } from "../../utils/utils_trendsHub";

type Props = {
	icon: string; // id in 'assets/icons/calendar.svg'
	tone: TrendTone; // the category's headline KPI tone
};

// A category's icon on a tile tinted by its headline tone
const TrendCategoryIcon = ({ icon, tone }: Props) => {
	return (
		<div className={styles.TrendCategoryIcon} style={getToneStyles(tone)}>
			<svg className={styles.TrendCategoryIcon_icon} aria-hidden="true">
				<use xlinkHref={`${sprite}#icon-${icon}`}></use>
			</svg>
		</div>
	);
};

export default TrendCategoryIcon;
