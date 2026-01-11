import styles from "../../css/weekly-recap/RecapProgressBars.module.scss";
import { differenceInWeeks } from "date-fns";
import { RecapBar } from "../../features/recaps/types";
import { CSSProperties, useEffect, useState } from "react";
import { durationTo } from "../../utils/utils_workouts";

type Props = {
	data: RecapBar[];
	color: string;
};

const getMinMaxFromData = (data: RecapBar[]) => {
	if (!data || !data?.length) return { min: 0, max: 100, step: 0 };
	// Get all non-zero values
	const values = data.map((x) => x.value).filter(Boolean);
	const min = Math.min(...values);
	const max = Math.max(...values);

	return {
		min: min,
		max: max,
		step: min,
	};
};

const getScaledWidth = (value: number, range: { min: number; max: number }) => {
	const { max } = range;
	if (value === 0) return 0;
	const newVal = value / max;

	return newVal * 100;
};

type BarProps = {
	value: number;
	data: RecapBar;
	color: string;
	isPrimary: boolean;
};
const gradient =
	"linear-gradient(to right top, #007cff, #0071f8, #0065f0, #005ae8, #004ee0)";

const getStyles = (isPrimary: boolean, color: string | null) => {
	if (isPrimary) {
		const prop = !color
			? { backgroundImage: gradient }
			: { backgroundColor: color };
		return {
			width: `0%`,
			...prop,
		};
	} else {
		return {
			width: `0%`,
			backgroundColor: color,
			backgroundImage: "none",
		};
	}
};

const getWhen = (when: string) => {
	const dist = differenceInWeeks(new Date(), when);
	if (dist === 1) {
		return "Past week";
	}
	const label = " weeks ago";
	return dist + label;
};

const animCurves = {
	bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
	splash: "cubic-bezier(0.68, -0.55, 0.27, 1.42)",
	calm: "cubic-bezier(0.68, 0, 0.27, 1.2)",
	smooth: "cubic-bezier(0.65, 0, 0.35, 1.05)",
};

const RecapBarItem = ({ data, color, value, isPrimary = false }: BarProps) => {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const { when, what, mins = 0 } = data;
	const totalMins = durationTo(mins, "h&m");
	const baseCss = getStyles(isPrimary, color);
	const whenLabel = getWhen(when);
	const css = {
		...baseCss,
		width: isMounted ? `${value}%` : "0%",
		transitionDelay: ".3s",
		transition: `width .6s ${animCurves.splash}`, // ensure transition is here if not in CSS
	} as CSSProperties;

	useEffect(() => {
		const timeout = setTimeout(() => setIsMounted(true), 20); // very short delay
		return () => {
			clearTimeout(timeout);
			setIsMounted(false);
		};
	}, []);

	return (
		<div className={styles.RecapBar}>
			<div className={styles.RecapBar_labels}>
				<div className={styles.RecapBar_labels_when}>{whenLabel}</div>
				<div className={styles.RecapBar_labels_what}>
					{what} ({totalMins})
				</div>
			</div>
			<div className={styles.RecapBar_bar} style={css}></div>
		</div>
	);
};

const defaultColor = "var(--blueGrey800)";

const sortBy = (data: RecapBar[], by: "date" | "value") => {
	switch (by) {
		case "value": {
			return [...data].sort((a, b) => {
				return a.value - b.value;
			});
		}
		case "date": {
			return [...data].sort((a, b) => {
				const dateA = new Date(a.when);
				const dateB = new Date(b.when);

				return dateB.getTime() - dateA.getTime();
			});
		}
		default:
			return data;
	}
};

const RecapProgressBars = ({ data = [], color = defaultColor }: Props) => {
	const { min, max } = getMinMaxFromData(data);
	const sorted = sortBy(data, "date");

	return (
		<div className={styles.RecapProgressBars}>
			{sorted &&
				sorted.map((bar, idx) => {
					const key = bar.value + "-" + idx;
					const isPrimary = idx === 0;
					const targetColor = isPrimary ? color : defaultColor;
					const value = getScaledWidth(bar.value, {
						min: min,
						max: max,
					});
					return (
						<RecapBarItem
							key={key}
							data={bar}
							value={value}
							color={targetColor}
							isPrimary={idx === 0}
						/>
					);
				})}
		</div>
	);
};

export default RecapProgressBars;
