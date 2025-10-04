import styles from "../../css/summary/WorkoutHistoryCalendarDay.module.scss";
import { getDate, isSameMonth } from "date-fns";
import { WorkoutCalendarDay } from "../../features/summary/types";
import { parseDate } from "../../utils/utils_dates";

type Props = {
	data: WorkoutCalendarDay;
	date: string;
	baseDate: string;
	onSelect: () => void;
	isSelected: boolean;
};

const isInMonth = (loggedDate: string, targetDate: string) => {
	const parsedLog = parseDate(loggedDate);
	const parsedTarget = parseDate(targetDate);
	const sameMonth = isSameMonth(parsedLog, parsedTarget);
	return sameMonth;
};

const getPercentage = (logged: number, goal: number) => {
	if (!goal && !logged) return 0;
	const percent = (logged / goal) * 100;

	return percent;
};

const getDayStyles = (
	percent: number,
	inMonth: boolean = true,
	metGoal: boolean = false
) => {
	const exceeds100 = percent >= 100;
	const fixedPercent = exceeds100 ? 100 : percent;
	const color = metGoal && percent !== 0 ? "var(--greenBG)" : "var(--redBG)";
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

const WorkoutHistoryCalendarDay = ({
	date,
	data,
	baseDate,
	onSelect,
	isSelected = false,
}: Props) => {
	const parsed = parseDate(date);
	const day = getDate(parsed);
	const inMonth = isInMonth(date, baseDate);
	const percent = getPercentage(
		data.totalMinsPerformed,
		data.totalMinsScheduled
	);
	const metGoal = data.metGoal && percent >= 100;
	const css = getDayStyles(percent, inMonth, metGoal);

	return (
		<div
			className={styles.WorkoutHistoryCalendarDay}
			style={{
				...css.main,
				borderColor: isSelected ? "var(--accent-blue)" : "var(--text1_5)",
			}}
		>
			<div onClick={onSelect} className={styles.WorkoutHistoryCalendarDay}>
				<div className={styles.WorkoutHistoryCalendarDay_day}>{day}</div>
				<div className={styles.WorkoutHistoryCalendarDay_container}>
					<div
						className={styles.WorkoutHistoryCalendarDay_container_fill}
						style={css.fill}
					></div>
				</div>
			</div>
		</div>
	);
};

export default WorkoutHistoryCalendarDay;
