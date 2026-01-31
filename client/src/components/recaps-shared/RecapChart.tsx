import styles from "../../css/recaps-shared/RecapChart.module.scss";
import { getIcon, getSprite, IconKey } from "../../utils/utils_icons";
import { addEllipsis } from "../../utils/utils_misc";
import AreaChart from "../ui/AreaChart";

type Props = {
	data: number[];
	icon: IconKey;
	label: string;
	chartFill?: string;
	chartStroke?: string;
};

const RecapChart = ({ data, icon, label, chartFill, chartStroke }: Props) => {
	const sprite = getSprite(icon);
	const iconName = getIcon(icon);
	const topLabel = addEllipsis(label, 14);
	return (
		<div className={styles.RecapChart}>
			<div className={styles.RecapChart_top}>
				<svg className={styles.RecapChart_top_icon}>
					<use xlinkHref={`${sprite}#icon-${iconName}`}></use>
				</svg>
				<div className={styles.RecapChart_top_title}>{topLabel}</div>
			</div>
			<div className={styles.RecapChart_chart}>
				<AreaChart data={data} fill={chartFill} stroke={chartStroke} />
			</div>
		</div>
	);
};

export default RecapChart;
