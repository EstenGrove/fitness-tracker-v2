import { useState } from "react";
import styles from "../../css/summary/YearlySummary.module.scss";
import { GradientColors, MinMaxStep, SummaryItem } from "./types";
import {
	defaultColors,
	getHighAndLowRanges,
	getScaledHeight,
} from "../../utils/utils_summary";

type Props = {
	title: string;
	data: SummaryItem[];
	colors?: GradientColors;
};

// SHOWS EVERY DAY IN THE YEAR

const getGradient = (colors: GradientColors) => {
	const merged = colors.join(", ");
	const gradient = `linear-gradient(to right top, ${merged})`;
	return gradient;
};

type BarProps = {
	label: string;
	value: number;
	colors: GradientColors;
};

const MonthBar = ({ label, value, colors = defaultColors }: BarProps) => {
	const gradient = getGradient(colors);
	const [showTooltip, setShowTooltip] = useState<boolean>(false);
	const month = label.slice(0, 3);
	const css = {
		height: `${value}%`,
		maxHeight: `${value}%`,
		backgroundImage: gradient,
	};

	return (
		<div className={styles.MonthBar} data-label={label} data-value={value}>
			<div className={styles.MonthBar_container}>
				<div
					style={css}
					className={styles.MonthBar_container_bar}
					onMouseOver={() => setShowTooltip(true)}
					onMouseLeave={() => setShowTooltip(false)}
					onTouchStart={() => setShowTooltip(true)}
					onTouchEnd={() => setShowTooltip(false)}
				>
					{showTooltip && (
						<div className={styles.MonthBar_container_bar_tooltip}>
							{Math.round(Number(value))}
						</div>
					)}
				</div>
			</div>
			<div className={styles.MonthBar_label}>{month}</div>
		</div>
	);
};

const YearlySummary = ({
	title = "",
	data = [],
	colors = defaultColors,
}: Props) => {
	const dataRange: MinMaxStep = getHighAndLowRanges(data);
	return (
		<div className={styles.YearlySummary}>
			<div className={styles.YearlySummary_title}>{title}</div>
			<div className={styles.YearlySummary_inner}>
				{data &&
					data.map((item, idx) => {
						const { value, label } = item;
						const key = `${value}--${idx}`;
						const scaledValue = getScaledHeight(value, {
							min: dataRange.min,
							max: dataRange.max,
						});
						return (
							<MonthBar
								key={key}
								label={label}
								value={scaledValue}
								colors={colors}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default YearlySummary;
