import styles from "../../css/recent-activity/NoSegments.module.scss";
import ProgressBar from "../ui/ProgressBar";

type Props = {
	title?: string;
};

const NoSegments = ({ title = "" }: Props) => {
	return (
		<div className={styles.NoSegments}>
			<div className={styles.NoSegments_title}>{title}</div>
			<ProgressBar progress={100} color="var(--blueGrey700)" />
		</div>
	);
};

export default NoSegments;
