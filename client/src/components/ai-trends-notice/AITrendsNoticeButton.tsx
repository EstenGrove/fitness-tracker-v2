import styles from "../../css/ai-trends-notice/AITrendsNoticeButton.module.scss";
import { AILatestTrendNotice } from "../../features/ai-trends/types";
import { getNoticeVariant } from "../../utils/utils_aiTrends";
import AnimatedTrendArrow from "../ui/AnimatedTrendArrow";

type Props = {
	notice: AILatestTrendNotice;
	onClick: () => void;
};

const defaultStyles = {
	direction: "up",
	gradient: "amethyst",
	size: 24,
	customStyles: {
		borderRadius: "50%",
		backgroundColor: "#000",
	},
};

// Re-opens the AI trends notice (eg. from the Dashboard header)
const AITrendsNoticeButton = ({ notice, onClick }: Props) => {
	const variant = getNoticeVariant(notice?.direction ?? "up");
	const direction = notice?.direction as "up" | "down";

	console.log(variant);

	return (
		<button
			type="button"
			className={styles.AITrendsNoticeButton}
			onClick={onClick}
			aria-label="View your weekly trends"
		>
			<AnimatedTrendArrow
				direction={direction || defaultStyles.direction}
				gradient={variant?.gradient || defaultStyles.gradient}
				customStyles={{ ...defaultStyles.customStyles }}
				size={defaultStyles.size}
			/>
		</button>
	);
};

export default AITrendsNoticeButton;
