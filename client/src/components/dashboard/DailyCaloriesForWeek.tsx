import { useState } from "react";
import { DailyCalories } from "../../features/dashboard/types";
import styles from "../../css/dashboard/DailyCaloriesForWeek.module.scss";

type Props = {
	recentCalories: DailyCalories[];
};

type WeekDayProps = {
	calories: number;
	date: string;
	weekDay: string;
	value: number;
};

const gradient =
	"linear-gradient(to right top, #ff333d, #ff2a45, #ff204c, #ff1354, #ff005b)";

const WeekDayBar = ({ calories, value, weekDay, date }: WeekDayProps) => {
	const [showTooltip, setShowTooltip] = useState<boolean>(false);
	const day = weekDay.slice(0, 3);
	const css = {
		height: `${value}%`,
		maxHeight: `${value}%`,
		backgroundImage: gradient,
	};

	return (
		<div
			className={styles.WeekDayBar}
			data-date={date}
			data-weekday={weekDay}
			data-value={value}
		>
			<div className={styles.WeekDayBar_container}>
				<div
					style={css}
					className={styles.WeekDayBar_container_bar}
					onMouseOver={() => setShowTooltip(true)}
					onMouseLeave={() => setShowTooltip(false)}
					onTouchStart={() => setShowTooltip(true)}
					onTouchEnd={() => setShowTooltip(false)}
				>
					{showTooltip && (
						<div className={styles.WeekDayBar_container_bar_tooltip}>
							{Math.round(calories)}
						</div>
					)}
				</div>
			</div>
			<div className={styles.WeekDayBar_day}>{day}</div>
		</div>
	);
};

interface MinMaxRange {
	min: number;
	max: number;
}

interface MinMaxStep extends MinMaxRange {
	step: number;
}

// We use the max value as our true max & we calculate heights based off what percentage of our max a given value is
const getScaledHeight = (value: number, range: MinMaxRange) => {
	const { max } = range;
	if (value === 0) return 0;
	const newVal = value / max;

	return newVal * 100;
};

// max: is the highest number plus our min (since 'min' is our increment/step)
const getHighAndLowRanges = (data: DailyCalories[]) => {
	const nonZeroNums: number[] = data
		.map(({ calories }) => calories)
		.filter((num) => num > 0);
	// get lowest non-zero value & highest value
	const max: number = Math.max(...nonZeroNums);
	const min: number = Math.min(...nonZeroNums);
	const step: number = min;

	return {
		max: max + step,
		min: min,
		step: step,
	};
};

const DailyCaloriesForWeek = ({ recentCalories }: Props) => {
	const dataRange: MinMaxStep = getHighAndLowRanges(recentCalories);

	return (
		<div className={styles.DailyCaloriesForWeek}>
			<div className={styles.DailyCaloriesForWeek_inner}>
				{recentCalories &&
					recentCalories.map((dayCals: DailyCalories, idx: number) => {
						const { calories, weekDay, date } = dayCals;
						const scaledCals = getScaledHeight(calories, {
							min: dataRange.min,
							max: dataRange.max,
						});

						return (
							<WeekDayBar
								key={date + idx}
								calories={calories}
								date={date}
								weekDay={weekDay}
								value={Math.abs(scaledCals)}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default DailyCaloriesForWeek;
