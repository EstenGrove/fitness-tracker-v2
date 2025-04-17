import { useState } from "react";
import { DailyMins } from "../../features/dashboard/types";
import styles from "../../css/dashboard/DailyMinsForWeek.module.scss";

type Props = {
	recentMins: DailyMins[];
};

type WeekDayProps = {
	mins: number;
	date: string;
	weekDay: string;
	value: number;
};

const gradient =
	"linear-gradient(to right top, #007cff, #0071f8, #0065f0, #005ae8, #004ee0)";

const WeekDayBar = ({ mins, value, weekDay, date }: WeekDayProps) => {
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
							{Math.round(mins)}
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
const getHighAndLowRanges = (data: DailyMins[]) => {
	const nonZeroNums: number[] = data
		.map(({ mins }) => mins)
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

const DailyMinsForWeek = ({ recentMins }: Props) => {
	const dataRange: MinMaxStep = getHighAndLowRanges(recentMins);

	return (
		<div className={styles.DailyMinsForWeek}>
			<div className={styles.DailyMinsForWeek_inner}>
				{recentMins &&
					recentMins.map((dayMins: DailyMins, idx: number) => {
						const { mins, weekDay, date } = dayMins;
						const scaledMins = getScaledHeight(mins, {
							min: dataRange.min,
							max: dataRange.max,
						});

						return (
							<WeekDayBar
								key={date + idx}
								mins={mins}
								date={date}
								weekDay={weekDay}
								value={Math.abs(scaledMins)}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default DailyMinsForWeek;
