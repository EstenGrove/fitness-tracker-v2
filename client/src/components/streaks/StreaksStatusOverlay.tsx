import sprite from "../../assets/icons/dashboard.svg";
import styles from "../../css/streaks/StreaksStatusOverlay.module.scss";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useBackgroundBlur } from "../../hooks/useBackgroundBlur";
import {
	CurrentStreak,
	WorkoutStreakDetails,
} from "../../features/streaks/types";
import { isToday, isYesterday } from "date-fns";
import { useWorkoutStreaks } from "../../hooks/useWorkoutStreaks";
import { useTypewriter } from "../../hooks/useTypewriter";
import StreakFlame from "./StreakFlame";
import { useNavigate } from "react-router";

type Props = {
	date: Date | string;
	onDismiss: () => void;
};

const isNewStreak = (streak: CurrentStreak): boolean => {
	const { currentStreak, streakEnd } = streak;

	// Previous streak was broken, starting a new one
	const isLowStreak = currentStreak <= 1;
	const endedRecently = isToday(streakEnd) || isYesterday(streakEnd);

	return isLowStreak && endedRecently;
};

const getStreakMessage = (streaks: WorkoutStreakDetails) => {
	if (!streaks) return "";
	const { currentStreak: current, longestStreak: longest } = streaks;
	const hasStreakEnded = isNewStreak(current);

	const { currentStreak } = current;
	const { longestStreak } = longest;

	// X days away from reaching the user's longest streak (ie. personal best!)
	const daysFromRecord = longestStreak - currentStreak;
	// Check if current is equal or close to the longest streak
	const isCloseToARecord =
		Boolean(daysFromRecord <= 3) || Boolean(currentStreak === longestStreak);

	const isNewRecord =
		current.streakStart === longest.streakStart &&
		currentStreak === longestStreak;

	switch (true) {
		case hasStreakEnded: {
			return `Today's a brand new day. Let's start out strong!!`;
		}
		case isNewRecord: {
			return `Incredible! That's a new streak record!!!`;
		}
		case isCloseToARecord: {
			return `Fantastic streak you've got! You're so close to a new record!!`;
		}
		case !hasStreakEnded && !isCloseToARecord: {
			return `Another day's here! Let's continue the streak! Keep pushing!!`;
		}

		default:
			return `Let's get started!!`;
	}
};

const StreaksStatusOverlay = ({ date, onDismiss }: Props) => {
	const navigate = useNavigate();
	const { data, isLoading } = useWorkoutStreaks(date);
	const current = data?.currentStreak;
	const streakText = getStreakMessage(data);
	const typedText = useTypewriter(streakText, {
		speed: 20,
		start: true,
	});
	useLockBodyScroll();
	useBackgroundBlur();

	const goToStreaks = () => {
		onDismiss();
		navigate("/awards");
	};

	return (
		<div className={styles.StreaksStatusOverlay}>
			<div className={styles.StreaksStatusOverlay_top}>
				<button
					type="button"
					onClick={onDismiss}
					className={styles.StreaksStatusOverlay_top_close}
				>
					<svg className={styles.StreaksStatusOverlay_top_close_icon}>
						<use xlinkHref={`${sprite}#icon-clear`}></use>
					</svg>
				</button>
			</div>
			<div className={styles.StreaksStatusOverlay_flame}>
				{!isLoading && (
					<StreakFlame size="XXLG" streak={current?.currentStreak} />
				)}
			</div>
			<div className={styles.StreaksStatusOverlay_streak}>
				<b>{current?.currentStreak}</b> <div> Day Streak</div>
			</div>
			<div className={styles.StreaksStatusOverlay_encourage}>{typedText}</div>

			<div className={styles.StreaksStatusOverlay_actions}>
				<button
					type="button"
					onClick={onDismiss}
					className={styles.StreaksStatusOverlay_actions_dismiss}
				>
					Dismiss
				</button>
				<button
					type="button"
					onClick={goToStreaks}
					className={styles.StreaksStatusOverlay_actions_goTo}
				>
					Go to Streaks & Awards
				</button>
			</div>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default StreaksStatusOverlay;
