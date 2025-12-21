import styles from "../../css/streaks/StreakFlame.module.scss";
import { StreakSize } from "../../utils/utils_streaks";
import FlameIcon from "../ui/FlameIcon";
import {
	FlameStreakTier,
	getFlameStreakTier,
	FLAME_STREAK_MAP,
} from "../../utils/utils_flame";

type Props = {
	streak: number;
	size?: StreakSize;
};

const StreakFlame = ({ streak, size = "XXLG" }: Props) => {
	const tier: FlameStreakTier = getFlameStreakTier(streak);
	const { variant, glow, pulse } = FLAME_STREAK_MAP[tier];

	return (
		// <div className={pulse ? styles["flame-pulse"] : undefined}>
		<FlameIcon variant={variant} glow={glow} size={size} />
		// </div>
	);
};

export default StreakFlame;
