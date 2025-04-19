import { ReactNode } from "react";
import styles from "../../css/summary/HistorySummary.module.scss";

type Props = {
	title: string;
	children?: ReactNode;
};

type HistorySummaryItemProps = {
	label: string;
	value: string | number;
};

const HistorySummaryItem = ({ label, value }: HistorySummaryItemProps) => {
	return (
		<div className={styles.HistorySummaryItem}>
			<div className={styles.HistorySummaryItem_label}>{label}</div>
			<div className={styles.HistorySummaryItem_value}>{value}</div>
		</div>
	);
};

const HistorySummary = ({ title, children }: Props) => {
	return (
		<div className={styles.HistorySummary}>
			<div className={styles.HistorySummary_header}>
				<h3>{title}</h3>
			</div>
			<div className={styles.HistorySummary_body}>{children}</div>
		</div>
	);
};

export { HistorySummaryItem };

export default HistorySummary;
