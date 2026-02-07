import DottedBarChart from "../ui/DottedBarChart";
import styles from "../../css/recaps-shared/RecapDottedChart.module.scss";
import { getIcon, getSprite, IconKey } from "../../utils/utils_icons";

type Props = {
	data: number[];
	title: string;
	icon: IconKey;
	maxValue: number;
	dotColor?: string;
	labelColor?: string;
	axisColor?: string;
};

const RecapDottedChart = ({
	data,
	maxValue = 32,
	title,
	icon,
	dotColor = "var(--strengthAccent)",
	labelColor = "var(--blueGrey200)",
	axisColor = "var(--blueGrey400)",
}: Props) => {
	const sheet = getSprite(icon);
	const iconName = getIcon(icon);
	return (
		<div className={styles.RecapDottedChart}>
			<DottedBarChart
				data={data}
				maxValue={maxValue}
				dotColor={dotColor}
				labelColor={labelColor}
				axisColor={axisColor}
			/>
			<div className={styles.RecapDottedChart_title}>
				<svg className={styles.RecapDottedChart_title_icon}>
					<use xlinkHref={`${sheet}#icon-${iconName}`}></use>
				</svg>
				<div className={styles.RecapDottedChart_title_text}>{title}</div>
			</div>
		</div>
	);
};

export default RecapDottedChart;
