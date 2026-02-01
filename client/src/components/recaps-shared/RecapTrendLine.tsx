import styles from "../../css/recaps-shared/RecapTrendLine.module.scss";
import TrendLine from "../ui/TrendLine";

type Props = {
	label: string;
	data: number[];
	stroke?: string;
	strokeWidth?: number;
};

const RecapTrendLine = ({ label, data, stroke, strokeWidth }: Props) => {
	return (
		<div className={styles.RecapTrendLine}>
			<div className={styles.RecapTrendLine_label}>{label}</div>
			<div className={styles.RecapTrendLine_line}>
				<TrendLine data={data} stroke={stroke} strokeWidth={strokeWidth} />
			</div>
		</div>
	);
};

export default RecapTrendLine;
