import styles from "../../css/awards/AwardsSummary.module.scss";
import { WorkoutAwards } from "../../features/awards/types";

type Props = {
	awards: WorkoutAwards;
};

type AwardItemProps = {
	label: string;
	value: number | string;
};

const AwardItem = ({ label, value }: AwardItemProps) => {
	return (
		<div className={styles.AwardItem}>
			<div className={styles.AwardItem_flame}>
				{/*  */}
				{/*  */}
			</div>
			<div className={styles.AwardItem_details}>
				<div className={styles.AwardItem_details_label}>{label}</div>
				<div className={styles.AwardItem_details_streak}>
					<b>{value}</b> days
				</div>
			</div>
		</div>
	);
};

const AwardsSummary = ({ awards }: Props) => {
	return (
		<div className={styles.AwardsSummary}>
			{/* Nth Awards */}
			{/* Record Awards */}
			{/* Pattern Awards */}
		</div>
	);
};

export default AwardsSummary;
