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
	titlePosition?: "top" | "bottom";
};

type TitleProps = {
	icon: IconKey;
	label: string;
	color?: string;
};

const Title = ({ icon, color, label }: TitleProps) => {
	const sprite = getSprite(icon);
	const iconName = getIcon(icon);
	const topLabel = addEllipsis(label, 30);
	return (
		<div className={styles.Title}>
			<svg className={styles.Title_icon} style={{ fill: color }}>
				<use xlinkHref={`${sprite}#icon-${iconName}`}></use>
			</svg>
			<div className={styles.Title_title}>{topLabel}</div>
		</div>
	);
};

const RecapChart = ({
	data,
	icon,
	label,
	chartFill,
	chartStroke,
	titlePosition = "top",
}: Props) => {
	const placeAtTop = titlePosition === "top";
	const placeAtBottom = titlePosition === "bottom";

	return (
		<div className={styles.RecapChart}>
			{placeAtTop && <Title icon={icon} label={label} color={chartStroke} />}
			<div className={styles.RecapChart_chart}>
				<AreaChart data={data} fill={chartFill} stroke={chartStroke} />
			</div>
			<div className={styles.RecapChart_bottom}>
				{placeAtBottom && (
					<Title icon={icon} label={label} color={chartStroke} />
				)}
			</div>
		</div>
	);
};

export default RecapChart;
