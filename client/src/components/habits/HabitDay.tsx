import styles from "../../css/habits/HabitDay.module.scss";
import { parseDate } from "../../utils/utils_dates";
import { HabitHistoryDay } from "../../features/habits/types";
import { getDate, isSameMonth } from "date-fns";
import { CSSProperties } from "react";

type Props = {
	data: HabitHistoryDay;
	goal: number;
	targetDate: string;
	onSelect: () => void;
};

const getDay = (loggedDate: string): number => {
	const parsed = parseDate(loggedDate);
	const day = getDate(parsed);

	return day;
};

const getPercentage = (logged: number, goal: number) => {
	const percent = (logged / goal) * 100;

	return percent;
};

const isInMonth = (loggedDate: string, targetDate: string) => {
	const parsedLog = parseDate(loggedDate);
	const parsedTarget = parseDate(targetDate);
	const sameMonth = isSameMonth(parsedLog, parsedTarget);
	return sameMonth;
};

const getDayStyles = (
	percent: number,
	inMonth: boolean = true,
	metGoal: boolean = false
) => {
	const exceeds100 = percent >= 100;
	const fixedPercent = exceeds100 ? 100 : percent;
	const color = metGoal ? "var(--greenBG)" : "var(--redBG)";
	const fill = {
		height: fixedPercent + "%",
		backgroundColor: color,
		borderTopLeftRadius: exceeds100 ? ".5rem" : "0",
		borderTopRightRadius: exceeds100 ? ".5rem" : "0",
	};
	const main = {
		opacity: inMonth ? 1 : 0.3,
	};

	return {
		fill,
		main,
	};
};

const HabitDay = ({ data, goal = 20, targetDate, onSelect }: Props) => {
	const { totalLogged, loggedDate, metGoal } = data;
	const day = getDay(loggedDate);
	const inMonth = isInMonth(loggedDate, targetDate);
	const percent = getPercentage(totalLogged, goal);
	const appliedStyles: Record<"main" | "fill", CSSProperties> = getDayStyles(
		percent,
		inMonth,
		metGoal
	);

	const handleSelect = () => {
		console.log("Goal:", goal);

		return onSelect && onSelect();
	};

	return (
		<div
			onClick={handleSelect}
			// onClick={onSelect}
			className={styles.HabitDay}
			style={appliedStyles.main}
		>
			<div className={styles.HabitDay_day}>{day}</div>
			<div className={styles.HabitDay_container}>
				<div
					className={styles.HabitDay_container_fill}
					style={appliedStyles.fill}
				></div>
			</div>
		</div>
	);
};

export default HabitDay;
