import StreakMedal from "./StreakMedal";
import {
	STREAK_MEDAL_CONFIG,
	StreakSize,
	getStreakTier,
} from "../../utils/utils_streaks";

type Props = {
	streak: number;
	size?: StreakSize;
};

const StreakTierMedal = ({ streak, size = "MD" }: Props) => {
	const tier = getStreakTier(streak);
	const config = STREAK_MEDAL_CONFIG[tier.tier];

	return (
		<StreakMedal
			streak={streak}
			size={size}
			color={config.color}
			label={config.label}
		/>
	);
};

export default StreakTierMedal;
