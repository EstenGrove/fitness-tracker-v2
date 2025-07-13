import {
	eachDayOfInterval,
	eachMonthOfInterval,
	eachWeekOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	isWithinInterval,
	startOfMonth,
} from "date-fns";
import styles from "../../css/habits/HabitHistoryCalendar.module.scss";
import {
	Habit as IHabit,
	HabitHistory,
	HabitHistoryDay,
	HabitHistory as IHabitHistory,
	HabitIntent,
} from "../../features/habits/types";
import { formatDate } from "../../utils/utils_dates";
import ProgressCircle from "../ui/ProgressCircle";
import { useMemo, useState } from "react";

interface CalendarRange {
	start: Date | string;
	end: Date | string;
}

type Props = {
	habit: IHabit;
	history: IHabitHistory;
	dateRange: CalendarRange;
};

type DayProps = {
	date: Date | string;
	historyDay: HabitHistoryDay | null;
	habit: IHabit;
};
type WeekProps = {
	habit: IHabit;
	weekStart: Date | string;
	weekEnd: Date | string;
	historyWeek: IHabitHistory; // all records within this week's range!
};
type MonthProps = {
	history: IHabitHistory;
	month: number;
	year: number;
	habit: IHabit;
};

const getHistoryInRange = (
	allHistory: IHabitHistory,
	dateRange: CalendarRange
): HabitHistory => {
	if (!allHistory || !allHistory.length) return [];

	const history = allHistory.filter((entry) => {
		return isWithinInterval(entry.date, dateRange);
	});

	console.log("history(for week)", history);

	return history;
};

const getHabitPercent = (entry: HabitHistoryDay, intent: HabitIntent) => {
	switch (intent) {
		case "BUILD": {
			return entry.percentage;
		}
		case "REDUCE": {
			return entry.reachedGoal || entry.habitValue <= entry.habitTarget
				? 100
				: entry.percentage;
		}
		case "LAPSE": {
			return entry.reachedGoal ? 100 : entry.percentage;
		}
		case "ELIMINATE": {
			return entry.reachedGoal ? 100 : entry.percentage;
		}

		default:
			return entry.percentage;
	}
};

const HabitDayPercent = ({ habit, historyDay, date }) => {
	return (
		<div className={styles.HabitDayPercent}>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

const HistoryDay = ({ date, habit, historyDay = null }: DayProps) => {
	const intent = habit.intent;
	const day = new Date(date).getDate();

	if (!historyDay) {
		return (
			<div className={styles.HistoryDayEmpty}>
				<div className={styles.HistoryDayEmpty_day}>{day}</div>
			</div>
		);
	}
	const percent = getHabitPercent(historyDay, intent);
	return (
		<div className={styles.HistoryDay}>
			<ProgressCircle percentage={percent} size="35" color="blue" />
			<div className={styles.HistoryDay_day}>{day}</div>
		</div>
	);
};
const HistoryWeek = ({ historyWeek, weekStart, weekEnd, habit }: WeekProps) => {
	const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
	return (
		<div className={styles.HistoryWeek}>
			<div className={styles.HistoryWeek_days}>
				{daysInWeek.map((day, idx) => {
					const data =
						historyWeek.find((entry) => {
							const entryDate = formatDate(entry.date, "db");
							const dayDate = formatDate(entry.date, "db");
							return entryDate === dayDate || isSameDay(day, entry.date);
						}) || null;
					return (
						<HistoryDay key={idx} date={day} historyDay={data} habit={habit} />
					);
				})}
			</div>
		</div>
	);
};

const getWeekEnd = (weekStart: Date | string) => {
	const end = endOfWeek(weekStart);
	if (!isSameMonth(end, weekStart)) {
		return endOfMonth(weekStart);
	}

	return end;
};

const HistoryMonth = ({ history, month, year, habit }: MonthProps) => {
	const baseDate = new Date(year, month, 1);
	const monthName = format(baseDate, "MMMM");
	const weeks = getCalendarWeeks(baseDate);

	return (
		<div className={styles.HistoryMonth}>
			<div className={styles.HistoryMonth_header}>
				<h4>{monthName}</h4>
				<h5>{year}</h5>
			</div>
			<div className={styles.HistoryMonth_weeks}>
				{weeks.map((week, idx) => {
					const weekEnd = getWeekEnd(week);
					const historyForWeek = getHistoryInRange(history, {
						start: week,
						end: weekEnd,
					});

					return (
						<HistoryWeek
							key={`WEEK-${idx}`}
							weekStart={week}
							weekEnd={weekEnd}
							historyWeek={historyForWeek}
							habit={habit}
						/>
					);
				})}
			</div>
		</div>
	);
};

const getCalendarWeeks = (date: Date | string) => {
	const monthStart = startOfMonth(date);
	const monthEnd = endOfMonth(date);
	const weekStarts = eachWeekOfInterval({ start: monthStart, end: monthEnd });

	return weekStarts.filter((date) => {
		return isSameMonth(monthStart, date);
	});
};

interface CurrentMonthAndYear {
	month: number;
	year: number;
}

const getInitialMonth = () => {
	const date = new Date();
	return {
		month: date.getMonth(),
		year: date.getFullYear(),
	};
};

const HabitHistoryCalendar = ({ habit, history, dateRange }: Props) => {
	const [currentMonth, setCurrentMonth] =
		useState<CurrentMonthAndYear>(getInitialMonth);
	const monthData = useMemo(() => {
		const monthBase = new Date(currentMonth.year, currentMonth.month, 1);
		const monthStart = startOfMonth(monthBase);
		const monthEnd = endOfMonth(monthBase);
		return getHistoryInRange(history, { start: monthStart, end: monthEnd });
	}, [currentMonth, history]);

	return (
		<div className={styles.HabitHistoryCalendar}>
			<div className={styles.HabitHistoryCalendar_months}>
				<HistoryMonth
					month={currentMonth.month}
					year={currentMonth.year}
					history={monthData}
					habit={habit}
				/>
			</div>
		</div>
	);
};

export default HabitHistoryCalendar;
