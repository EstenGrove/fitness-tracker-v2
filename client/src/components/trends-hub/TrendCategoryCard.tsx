import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/trends-hub/TrendCategoryCard.module.scss";
import { TrendCategoryCard as CategoryCard } from "../../features/trends-hub/types";
import { TREND_CATEGORIES } from "../../features/trends-hub/categories";
import { formatTrendValue } from "../../utils/utils_trendsHub";
import TrendCategoryIcon from "./TrendCategoryIcon";
import TrendChangePill from "./TrendChangePill";

type Props = {
	card: CategoryCard;
	onClick: () => void;
};

// A category on the hub: its headline KPI + top insight; opens the category's detail page
const TrendCategoryCard = ({ card, onClick }: Props) => {
	const { kpi, insight } = card;
	const config = TREND_CATEGORIES[card.category];

	return (
		<button
			type="button"
			className={styles.TrendCategoryCard}
			onClick={onClick}
		>
			<div className={styles.TrendCategoryCard_header}>
				<TrendCategoryIcon icon={config.icon} tone={kpi.tone} />
				<h3 className={styles.TrendCategoryCard_title}>{config.title}</h3>
				<svg className={styles.TrendCategoryCard_chevron} aria-hidden="true">
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_right`}></use>
				</svg>
			</div>
			<div className={styles.TrendCategoryCard_headline}>
				<span className={styles.TrendCategoryCard_value}>
					{formatTrendValue(kpi.value, kpi.unit)}
				</span>
				<span className={styles.TrendCategoryCard_caption}>
					{config.headlineCaption}
				</span>
				<span className={styles.TrendCategoryCard_change}>
					<TrendChangePill kpi={kpi} />
				</span>
			</div>
			{insight && (
				<p className={styles.TrendCategoryCard_insight}>{insight.text}</p>
			)}
		</button>
	);
};

export default TrendCategoryCard;
