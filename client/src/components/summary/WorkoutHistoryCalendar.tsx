import { useMemo, useState } from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/summary/WorkoutHistoryCalendar.module.scss";
import {
	formatDate,
	MONTHS,
	parseDate,
	WEEK_DAYS,
} from "../../utils/utils_dates";
import { WorkoutCalendarDay } from "../../features/summary/types";
import WorkoutHistoryCalendarDay from "./WorkoutHistoryCalendarDay";
import { endOfMonth, endOfWeek, isWithinInterval, startOfWeek } from "date-fns";

type Props = {
	data: WorkoutCalendarDay[];
	onSelect: (date: string) => void;
	selectedDate: string | null;
};

interface CalendarState {
	month: number;
	year: number;
}

const WeekDayLabel = ({ day }: { day: string }) => {
	return (
		<div className={styles.WeekDayLabel}>
			<div className={styles.WeekDayLabel_day}>{day}</div>
		</div>
	);
};

type ControlsProps = {
	onPrev: () => void;
	onNext: () => void;
};

const CalendarControls = ({ onPrev, onNext }: ControlsProps) => {
	return (
		<div className={styles.CalendarControls}>
			<button
				type="button"
				onClick={onPrev}
				className={styles.CalendarControls_prev}
			>
				<svg className={styles.CalendarControls_prev_icon}>
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_left`}></use>
				</svg>
			</button>
			<button
				type="button"
				onClick={onNext}
				className={styles.CalendarControls_next}
			>
				<svg className={styles.CalendarControls_next_icon}>
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_right`}></use>
				</svg>
			</button>
		</div>
	);
};

type CalendarHeaderProps = {
	month: string;
	year: number;
	onPrev: () => void;
	onNext: () => void;
};

const CalendarHeader = ({
	month = "September",
	year = 2025,
	onPrev,
	onNext,
}: CalendarHeaderProps) => {
	const weekdays = [...WEEK_DAYS];
	return (
		<section className={styles.CalendarHeader}>
			<div className={styles.CalendarHeader_current}>
				<div className={styles.CalendarHeader_current_month}>{month}</div>
				<div className={styles.CalendarHeader_current_year}>{year}</div>
				<CalendarControls onNext={onNext} onPrev={onPrev} />
			</div>
			<div className={styles.CalendarHeader_weekdays}>
				{weekdays.map((day, idx) => {
					const key = `${idx}_${day}`;
					const weekday = day.slice(0, 2);
					return <WeekDayLabel key={key} day={weekday} />;
				})}
			</div>
		</section>
	);
};

type WorkoutHistoryMonthProps = {
	baseDate: string; // a date within our target month/year we can compare to
	data: WorkoutCalendarDay[];
	selectedDate: string | null;
	onSelect: (date: string) => void;
};

const isSelected = (loggedDate: string, selectedDate: string | null) => {
	if (!selectedDate) return false;
	const parsed = parseDate(loggedDate);
	const date = formatDate(parsed, "db");
	return date === selectedDate;
};

const WorkoutHistoryMonth = ({
	baseDate,
	data,
	onSelect,
	selectedDate,
}: WorkoutHistoryMonthProps) => {
	return (
		<div className={styles.WorkoutHistoryMonth}>
			{data &&
				data.map((entry, idx) => {
					const { date } = entry;
					const key = idx;
					const isDateSelected = isSelected(date, selectedDate);
					return (
						<WorkoutHistoryCalendarDay
							key={key}
							data={entry}
							date={date}
							baseDate={baseDate}
							onSelect={() => onSelect(date)}
							isSelected={isDateSelected}
						/>
					);
				})}
		</div>
	);
};

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

const filterDataBy = (
	data: WorkoutCalendarDay[],
	calendarState: CalendarState
) => {
	const { month, year } = calendarState;
	const { alignedStart, alignedEnd } = getMonthAlignedDates(month, year);

	const monthHistory = data.filter((entry) => {
		const { date } = entry;
		const inInterval = isWithinInterval(date, {
			start: alignedStart,
			end: alignedEnd,
		});
		return inInterval;
	});

	return monthHistory;
};

const WorkoutHistoryCalendar = ({ data, onSelect, selectedDate }: Props) => {
	const today = new Date();

	const [calendarState, setCalendarState] = useState<CalendarState>({
		month: today.getMonth(),
		year: today.getFullYear(),
	});
	const { month, year } = calendarState;
	const baseDate = formatDate(new Date(year, month, 1), "db");
	const monthName = useMemo(() => {
		return MONTHS[month];
	}, [month]);

	const monthData = useMemo(() => {
		if (!data || !data?.length) return [];
		return filterDataBy(data, calendarState);
	}, [calendarState, data]);

	const onDateSelect = (date: string) => {
		return onSelect && onSelect(date);
	};

	const getNextMonth = () => {
		const isEnd = month === 11;
		const nextMonth = isEnd ? 0 : month + 1;
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

	return (
		<div className={styles.WorkoutHistoryCalendar}>
			<CalendarHeader
				month={monthName}
				year={year}
				onPrev={getPrevMonth}
				onNext={getNextMonth}
			/>
			<WorkoutHistoryMonth
				baseDate={baseDate}
				data={monthData}
				onSelect={onDateSelect}
				selectedDate={selectedDate}
			/>
		</div>
	);
};

export default WorkoutHistoryCalendar;
