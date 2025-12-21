import React from "react";
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
import FlameIcon from "../ui/FlameIcon";
import StreakFlame from "./StreakFlame";

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
	const { currentStreak: current, longestStreak: longest } = streaks;
	const hasStreakEnded = isNewStreak(current);

	const { currentStreak } = current;
	const { longestStreak } = longest;

	// X days away from reaching the user's longest streak (ie. personal best!)
	const daysFromRecord = longestStreak - currentStreak;
	// Check if current is equal or close to the longest streak
	const isCloseToARecord =
		Boolean(daysFromRecord <= 3) || Boolean(currentStreak === longestStreak);

	switch (true) {
		case hasStreakEnded: {
			return `Today's a brand new day. Let's start out strong!!`;
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
	const { data, isLoading } = useWorkoutStreaks(date);
	console.log("data:", data);
	// const { currentStreak: current, longestStreak: longest } = data;
	// const streakText = getStreakMessage(data);
	// const typedText = useTypewriter(streakText, {
	//   speed: 20,
	//   start: true
	// })

	useLockBodyScroll();
	useBackgroundBlur();
	return (
		<div className={styles.StreaksStatusOverlay}>
			<div className={styles.StreaksStatusOverlay_flame}>
				<StreakFlame
					size="XXLG"
					// streak={current?.currentStreak}
					streak={2}
				/>
			</div>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default StreaksStatusOverlay;
