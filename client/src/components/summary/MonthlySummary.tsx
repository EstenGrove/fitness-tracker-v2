import styles from "../../css/summary/MonthlySummary.module.scss";
import { SummaryItem } from "./types";

type Props = {
	title: string;
	labels: string[];
	data: SummaryItem[];
};

// SHOWS EVERY DAY IN THE MONTH

const MonthlySummary = ({ title = "", labels = [], data = [] }: Props) => {
	return (
		<div className={styles.MonthlySummary}>
			<div className={styles.MonthlySummary_title}>{title}</div>
			<div className={styles.MonthlySummary_body}>
				{/*  */}
				{/*  */}
			</div>
		</div>
	);
};

export default MonthlySummary;
