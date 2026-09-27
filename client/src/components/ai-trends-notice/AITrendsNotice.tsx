import {
	AINoticeDirection,
	AITrendNotice,
} from "../../features/ai-trends/types";
import sprite from "../../assets/dashboard.svg";
import styles from "./AITrendsNotice.module.scss";

type Props = {
	trendData: AITrendNotice | null;
	onClose: () => void;
};

const CloseIcon = ({ onClose }: { onClose: () => void }) => {
	return (
		<button type="button" className={styles.CloseIcon} onClick={onClose}>
			<svg className={styles.CloseIcon_icon}>
				<use xlinkHref={`${sprite}#icon-clear`}></use>
			</svg>
		</button>
	);
};

const getTrendArrowDirection = (direction: AINoticeDirection) => {
	switch (direction) {
		case "POSITIVE":
			return "up";
		case "NEGATIVE":
			return "down";
		case "MIXED":
			return "up";
	}
};

const AITrendsNotice = ({ trendData, onClose }: Props) => {
	if (!trendData) {
		return null;
	}

	const { title, direction } = trendData;
	const trendDirection = getTrendArrowDirection(direction);
	return (
		<div className={styles.AITrendsNotice}>
			<div className={styles.AITrendsNotice_header}>
				<h2 className={styles.AITrendsNotice_title}>{title}</h2>
				<CloseIcon onClose={onClose} />
			</div>
			<div className={styles.AITrendsNotice_content}>
				{/*  */}
				{/*  */}
				{/*  */}
			</div>
		</div>
	);
};

export default AITrendsNotice;
