import styles from "../../css/summary/StatsSummary.module.scss";
import { StatsSummaryItem } from "../../features/stats/types";
import { isFirstDayOfMonth } from "date-fns";
import DetailsCard from "../layout/DetailsCard";
import NoData from "../ui/NoData";
import { iconsMap } from "../../utils/utils_icons";
import {
	getHighAndLowRanges,
	getScaledHeight,
	MinMaxRange,
} from "../../utils/utils_stats";
import { useState } from "react";
import { formatDate } from "../../utils/utils_dates";

type StatsColor =
	| "red"
	| "blue"
	| "green"
	| "pink"
	| "yellow"
	| "orange"
	| "purple"
	| "rainbow";

type Props = {
	icon: keyof (typeof iconsMap)[1] | keyof (typeof iconsMap)[2];
	title: string;
	color?: StatsColor;
	summary: StatsSummaryItem[];
};

const isNewMonth = (summary: StatsSummaryItem[]) => {
	const now = new Date();
	const noData = !summary || !summary.length;
	const isMonthStart = isFirstDayOfMonth(now);

	return noData && isMonthStart;
};

interface MinMaxStep extends MinMaxRange {
	step: number;
}

type StatsBarProps = {
	date: string;
	value: number;
	label: number | string;
	color: StatsColor;
};

const getColorGradient = (color: StatsColor) => {
	const colorsMap = {
		red: "var(--redGradient)",
		blue: "var(--blueGradient)",
		green: "var(--greenGradient)",
		orange: "var(--orangeGradient)",
		pink: "var(--pinkGradient)",
		purple: "var(--purpleGradient)",
		rainbow: "var(--rainbowGradient)",
	};
	if (color in colorsMap) {
		return colorsMap[color as keyof object];
	}
	return colorsMap.blue;
};

const getColor = (color: StatsColor): string => {
	const colorsMap = {
		red: "var(--accent-red)",
		blue: "var(--accent-blue)",
		green: "var(--accent-green)",
		orange: "var(--accent-orange)",
		pink: "var(--accent)",
		purple: "var(--accent-purple)",
		rainbow: "var(--accent)",
	};

	return color in colorsMap ? colorsMap[color as keyof object] : colorsMap.blue;
};

const StatsBar = ({ date, value, label, color }: StatsBarProps) => {
	const [showTooltip, setShowTooltip] = useState<boolean>(false);
	const gradient = getColorGradient(color);
	const trimmedLabel = String(label).slice(0, 1);
	const css = {
		height: `${value}%`,
		maxHeight: `${value}%`,
		backgroundImage: gradient,
	};
	return (
		<div
			className={styles.StatsBar}
			data-date={date}
			data-label={label}
			data-value={value}
		>
			<div className={styles.StatsBar_container}>
				<div
					style={css}
					className={styles.StatsBar_container_bar}
					onMouseOver={() => setShowTooltip(true)}
					onMouseLeave={() => setShowTooltip(false)}
					onTouchStart={() => setShowTooltip(true)}
					onTouchEnd={() => setShowTooltip(false)}
				>
					{showTooltip && (
						<div className={styles.StatsBar_container_bar_tooltip}>
							{Math.round(value)}
						</div>
					)}
				</div>
			</div>
			<div className={styles.StatsBar_day}>{trimmedLabel}</div>
		</div>
	);
};

const StatsSummary = ({
	summary,
	icon = "calendarHistory",
	title = "Stats Summary",
	color = "blue",
}: Props) => {
	const year = new Date(summary?.[0]?.date).getFullYear();
	const isBrandNewMonth = isNewMonth(summary);
	const colorKey = getColor(color);
	const dataRange: MinMaxStep = getHighAndLowRanges(summary);
	const hasData =
		summary &&
		summary.length &&
		summary.reduce((acc, item) => (acc += item.value), 0) > 0;
	const width = Math.round(100 / summary.length);
	console.log("width:", width);
	return (
		<div className={styles.StatsSummary}>
			<DetailsCard icon={icon} title={`${title} - ${year}`} color={colorKey}>
				{isBrandNewMonth && <NoData icon="noData" />}

				<div className={styles.StatsSummary_inner}>
					{hasData &&
						summary.map((stat, idx) => {
							const { value, label, date } = stat;
							const key = `${label}-${date}-${idx}`;
							const statsDate = formatDate(date, "db");
							const scaledValue = getScaledHeight(value, {
								min: dataRange.min,
								max: dataRange.max,
							});

							return (
								<StatsBar
									key={key}
									label={label}
									value={scaledValue}
									date={statsDate}
									color={color}
								/>
							);
						})}
				</div>
			</DetailsCard>
		</div>
	);
};

export default StatsSummary;
