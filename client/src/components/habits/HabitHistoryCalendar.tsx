import styles from "../../css/habits/HabitHistoryCalendar.module.scss";
import {
	Habit,
	HabitHistory,
	HabitHistoryDay,
} from "../../features/habits/types";
import sprite from "../../assets/icons/calendar.svg";
import { formatDate, MONTHS, WEEK_DAYS } from "../../utils/utils_dates";
import { useMemo, useState } from "react";
import { DateRange } from "../../features/types";
import HabitDay from "./HabitDay";
import { endOfMonth, endOfWeek, isWithinInterval, startOfWeek } from "date-fns";

type Props = {
	habit: Habit;
	history: HabitHistory;
	dateRange: DateRange;
	onSelect: (date: string) => void;
};

type CalendarMonthProps = {
	baseDate: string; // a date within our target month/year we can compare to
	history: HabitHistory;
	onSelect: (date: string) => void;
};

const HabitCalendarMonth = ({
	baseDate,
	history,
	onSelect,
}: CalendarMonthProps) => {
	return (
		<div className={styles.HabitCalendarMonth}>
			{history &&
				history.map((entry, idx) => {
					return (
						<HabitDay
							key={idx}
							data={entry}
							goal={entry.goal}
							targetDate={baseDate} // date within the target month
							onSelect={() => onSelect(entry.loggedDate)}
						/>
					);
				})}
		</div>
	);
};

type HabitHeaderProps = {
	month: string;
	year: number;
	onPrev: () => void;
	onNext: () => void;
};

const WeekDayLabel = ({ day }: { day: string }) => {
	return (
		<div className={styles.WeekDayLabel}>
			<div className={styles.WeekDayLabel_day}>{day}</div>
		</div>
	);
};

const HabitHeader = ({
	month = "September",
	year = 2025,
	onPrev,
	onNext,
}: HabitHeaderProps) => {
	const weekdays = [...WEEK_DAYS];
	return (
		<section className={styles.HabitHeader}>
			<div className={styles.HabitHeader_current}>
				<div className={styles.HabitHeader_current_month}>{month}</div>
				<div className={styles.HabitHeader_current_year}>{year}</div>
				<HabitCalendarControls onNext={onNext} onPrev={onPrev} />
			</div>
			<div className={styles.HabitHeader_weekdays}>
				{weekdays.map((day, idx) => {
					const key = `${idx}_${day}`;
					const weekday = day.slice(0, 2);
					return <WeekDayLabel key={key} day={weekday} />;
				})}
			</div>
		</section>
	);
};

type ControlsProps = {
	onPrev: () => void;
	onNext: () => void;
};

const HabitCalendarControls = ({ onPrev, onNext }: ControlsProps) => {
	return (
		<div className={styles.HabitCalendarControls}>
			<button
				type="button"
				onClick={onPrev}
				className={styles.HabitCalendarControls_prev}
			>
				<svg className={styles.HabitCalendarControls_prev_icon}>
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_left`}></use>
				</svg>
			</button>
			<button
				type="button"
				onClick={onNext}
				className={styles.HabitCalendarControls_next}
			>
				<svg className={styles.HabitCalendarControls_next_icon}>
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_right`}></use>
				</svg>
			</button>
		</div>
	);
};

interface MonthAndYear {
	month: number;
	year: number;
}

const getMonthAlignedDates = (month: number, year: number) => {
	const monthStart = new Date(year, month, 1);
	const monthEnd = endOfMonth(monthStart);

	const weekStartForMonthStart = startOfWeek(monthStart);
	const weekEndForMonthEnd = endOfWeek(monthEnd);

	return {
		monthStart: formatDate(monthStart, "db"),
		monthEnd: formatDate(monthEnd, "db"),
		alignedStart: formatDate(weekStartForMonthStart, "db"),
		alignedEnd: formatDate(weekEndForMonthEnd, "db"),
	};
};

const filterHistoryBy = (
	history: HabitHistoryDay[],
	monthAndYear: MonthAndYear
) => {
	const { month, year } = monthAndYear;
	const { alignedStart, alignedEnd } = getMonthAlignedDates(month, year);

	const monthHistory = history.filter((entry) => {
		const { loggedDate } = entry;
		const inInterval = isWithinInterval(loggedDate, {
			start: alignedStart,
			end: alignedEnd,
		});
		return inInterval;
	});

	return monthHistory;
};

const HabitHistoryCalendar = ({ habit, history, onSelect }: Props) => {
	const today = new Date();
	const [calendarState, setCalendarState] = useState<MonthAndYear>({
		month: today.getMonth(),
		year: today.getFullYear(),
	});
	const { month, year } = calendarState;
	const baseDate = formatDate(new Date(year, month, 1), "db");

	const monthName = useMemo(() => {
		return MONTHS[month];
	}, [month]);

	const monthHistory: HabitHistoryDay[] = useMemo(() => {
		if (!history) return [] as HabitHistoryDay[];
		return filterHistoryBy(history, calendarState);
	}, [calendarState, history]);

	const getNextMonth = () => {
		const { month, year } = calendarState;
		const isEnd = month === 11;
		const nextMonth = isEnd ? 1 : month + 1;
		const nextYear = isEnd ? year + 1 : year;
		setCalendarState({
			month: nextMonth,
			year: nextYear,
		});
	};
	const getPrevMonth = () => {
		const { month, year } = calendarState;
		const isStart = month === 0;
		const prevMonth = isStart ? 11 : month - 1;
		const prevYear = isStart ? year - 1 : year;
		setCalendarState({
			month: prevMonth,
			year: prevYear,
		});
	};

	const selectDate = (date: string) => {
		return onSelect && onSelect(date);
	};

	return (
		<div className={styles.HabitHistoryCalendar}>
			<HabitHeader
				month={monthName}
				year={calendarState.year}
				onNext={getNextMonth}
				onPrev={getPrevMonth}
			/>
			<HabitCalendarMonth
				history={monthHistory}
				baseDate={baseDate}
				onSelect={selectDate}
			/>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default HabitHistoryCalendar;
