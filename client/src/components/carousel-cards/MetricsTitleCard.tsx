import styles from "../../css/carousel-cards/MetricsTitleCard.module.scss";

type Props = {
	data: {
		title: string;
		desc: string;
	};
	isActive: boolean;
};

const defaultTitle = "How does this session compare to your previous sessions?";
const defaultDesc = "Your comparison against the last {lastXDays} days.";

const MetricsTitleCard = ({ data, isActive }: Props) => {
	const title = data?.title ?? defaultTitle;
	const desc = data?.desc ?? defaultDesc;
	if (!isActive) return null;
	return (
		<div className={styles.MetricsTitleCard}>
			<div className={styles.Title}>{title}</div>

			<h6 className={styles.Desc}>{desc}</h6>
		</div>
	);
};

export default MetricsTitleCard;
