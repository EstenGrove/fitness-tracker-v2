import styles from "../../css/awards/StreakAward.module.scss";
import { StreakSize } from "../../utils/utils_streaks";
import { formatDate, parseAnyDate } from "../../utils/utils_dates";
import StreakFlame from "../streaks/StreakFlame";

type Props = {
	label: string;
	value: number | string;
	hasAchieved: boolean;
	achievedOn: string;
	flameSize?: StreakSize;
	onClick?: () => void;
};

const getStyles = (hasAchieved: boolean) => {
	if (hasAchieved) {
		return {
			opacity: "1",
		};
	}
	return {
		opacity: ".3",
	};
};

const getAchievedDate = (achievedOn: string | null) => {
	if (!achievedOn) return "";
	const parsed = parseAnyDate(achievedOn);
	if (parsed instanceof Date) {
		return formatDate(parsed, "long");
	}
	return "";
};

const StreakAward = ({
	label,
	value,
	hasAchieved,
	achievedOn,
	flameSize = "XLG",
	onClick,
}: Props) => {
	const achievedDate = getAchievedDate(achievedOn);
	const normedStreak = !hasAchieved ? -1 : Number(value);

	const handleClick = () => {
		return onClick && onClick();
	};

	return (
		<div
			className={styles.StreakAward}
			style={getStyles(hasAchieved)}
			onClick={handleClick}
		>
			<div className={styles.StreakAward_flame}>
				<StreakFlame streak={normedStreak} size={flameSize} />
			</div>
			<div className={styles.StreakAward_details}>
				<div className={styles.StreakAward_details_label}>{label}</div>
				<div className={styles.StreakAward_details_streak}>
					<b>{value}</b> days
				</div>
				<div className={styles.StreakAward_details_achieved_on}>
					{hasAchieved && <div>{achievedOn ? achievedDate : ""}</div>}
				</div>
			</div>
		</div>
	);
};

export default StreakAward;
