import { useEffect, useRef, useState } from "react";
import styles from "../../css/calendars/DateRangeCalendar.module.scss";
import {
	addDays,
	eachDayOfInterval,
	format,
	getDate,
	parse,
	subMonths,
	startOfMonth,
	eachMonthOfInterval,
	eachWeekOfInterval,
	endOfMonth,
	endOfWeek,
	isWithinInterval,
	isAfter,
	isSameMonth,
	getYear,
	startOfWeek,
} from "date-fns";
import { formatDate, WEEK_DAYS } from "../../utils/utils_dates";

interface ConfirmedRange {
	startDate: Date | string;
	endDate: Date | string;
}

type Props = {
	showXMonths?: number;
	initialSelection?: SelectedRange;
	onClose: () => void;
	onConfirm: (range: ConfirmedRange) => void;
};

interface MonthData {
	[weekIdx: number]: Date[];
}

interface CalendarDates {
	[monthName: string]: MonthData;
}

type DayProps = {
	day: number;
	isStart: boolean;
	isEnd: boolean;
	isInMonth: boolean;
	isInSelection: boolean;
	onSelect: () => void;
};

const getCleanStyles = (classes: Array<string | boolean>): string => {
	return classes.filter(Boolean).join(" ");
};

const Day = ({
	day, // day of the month (eg 31, or 15)
	onSelect,
	isStart = false, // is start date
	isEnd = false, // is end date
	isInMonth = false, // date is part of month
	isInSelection = false, // date is within selected range
}: DayProps) => {
	const isBoth = isStart && isEnd;
	const classes = getCleanStyles([
		styles.Day,
		!isInMonth && styles.notInMonth,
		isInSelection && styles.inSelectedRange,
		isStart && styles.isStart,
		isEnd && styles.isEnd,
		isBoth && styles.isStartEnd,
	]);

	return (
		<div
			className={classes}
			data-in-month={isInMonth}
			data-in-selection={isInSelection}
			onClick={onSelect}
		>
			{day}
		</div>
	);
};

type MonthDatesProps = {
	month: string;
	monthData: MonthData;
	selectedRange: SelectedRange;
	onSelect: (date: Date | string) => void;
};

const isInRange = (date: Date, start: Date, end: Date) => {
	return isWithinInterval(date, { start, end });
};

const getMonthRangeFromKey = (key: string) => {
	const baseDate = parse(key, "MM/yyyy", new Date());
	const start = startOfMonth(baseDate);
	const end = endOfMonth(baseDate);
	return {
		start,
		end,
	};
};

const isDateInSelectedRange = (
	date: Date,
	start: Date | string | null,
	end: Date | string | null
) => {
	if (!start) return false;
	if (!end) {
		return isAfter(date, start);
	}
	return isInRange(date, start as Date, end as Date);
};

const isSameDate = (date: Date, startOrEnd: Date | string | null) => {
	if (!startOrEnd) return false;

	const dateStr = formatDate(date, "long");
	const sOrEStr = formatDate(startOrEnd, "long");

	return dateStr === sOrEStr;
};

const isThisMonth = (monthStr: string) => {
	const parsed = parse(monthStr, "MM/yyyy", new Date());
	const now = new Date();

	return isSameMonth(parsed, now);
};

const MonthDates = ({
	month,
	monthData,
	onSelect,
	selectedRange,
}: MonthDatesProps) => {
	const monthRef = useRef<HTMLDivElement>(null);
	const weekStarts = Object.keys(monthData);
	const monthName = getMonthNameFromKey(month);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (isThisMonth(month)) {
			monthRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}

		return () => {
			isMounted = false;
		};
	}, [month]);

	return (
		<div ref={monthRef} className={styles.MonthDates}>
			<div className={styles.MonthDates_name}>
				<h4>{monthName}</h4>
			</div>
			<div className={styles.MonthDates_weeks}>
				{weekStarts.map((weekStart, idx) => {
					// NOTE: 'weekStart' is an index of which week in the month (eg. 0-4)
					// 'weekStarts' is an array of week start dates for a given month
					const weekKey = `WEEK-${idx}`;
					const dates = monthData[weekStart as keyof object] || [];

					return (
						<div key={weekKey} className={styles.MonthDates_weeks_week}>
							{dates.map((date, index) => {
								const day = getDate(date);
								const key = `${index}--${day}`;
								const { start, end } = getMonthRangeFromKey(month);
								const { startDate, endDate } = selectedRange;
								const inMonth = isInRange(date, start, end);
								const isStart = isSameDate(date, startDate);
								const isEnd = isSameDate(date, endDate);
								const inSelection = isDateInSelectedRange(
									date,
									startDate,
									endDate
								);

								return (
									<Day
										key={key}
										day={day}
										isStart={isStart}
										isEnd={isEnd}
										isInMonth={inMonth}
										isInSelection={inSelection}
										onSelect={() => onSelect(date)}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const futureBuffer = 14; // show last X months + futureBuffer days in the future

const CalendarHeader = ({
	month = "May",
	year = 2025,
}: {
	month: string;
	year: number;
}) => {
	const dayLabels = [...WEEK_DAYS];
	return (
		<div className={styles.CalendarHeader}>
			<div className={styles.CalendarHeader_current}>
				<div className={styles.CalendarHeader_current_month}>{month}</div>
				<div className={styles.CalendarHeader_current_year}>{year}</div>
			</div>
			<div className={styles.CalendarHeader_weekdays}>
				{dayLabels.map((label, idx) => {
					const day = label.slice(0, 1);
					return (
						<div key={day + idx} className={styles.CalendarHeader_weekdays_day}>
							{day}
						</div>
					);
				})}
			</div>
		</div>
	);
};
type CalendarFooterProps = {
	onReset: () => void;
	onCancel: () => void;
	onConfirm: () => void;
};

const CalendarFooter = ({
	onReset,
	onCancel,
	onConfirm,
}: CalendarFooterProps) => {
	return (
		<div className={styles.CalendarFooter}>
			<button
				type="button"
				onClick={onReset}
				className={styles.CalendarFooter_reset}
			>
				Reset
			</button>
			<button
				type="button"
				onClick={onCancel}
				className={styles.CalendarFooter_cancel}
			>
				Cancel
			</button>
			<button
				type="button"
				onClick={onConfirm}
				className={styles.CalendarFooter_confirm}
			>
				Confirm
			</button>
		</div>
	);
};

// Key: '11/2025'
const getMonthNameFromKey = (monthKey: string) => {
	const baseDate = parse(monthKey, "MM/yyyy", new Date());
	const month = format(baseDate, "LLLL");
	return month;
};

interface SelectedRange {
	startDate: Date | string | null;
	endDate: Date | string | null;
}

const hasStart = (selections: SelectedRange): boolean => {
	return !!selections.startDate;
};
const hasEnd = (selections: SelectedRange): boolean => {
	return !!selections.endDate;
};
const hasBoth = (selections: SelectedRange): boolean => {
	return !!selections.startDate && !!selections.endDate;
};

const getMonthsInRange = (start: Date, end: Date): Date[] => {
	const monthDates = eachMonthOfInterval({ start, end });

	return monthDates;
};

const getWeeksInRange = (start: Date, end: Date): Date[] => {
	const weekDates = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 });

	return weekDates;
};

const getWeeks = (weekStarts: Date[]) => {
	const weeks = {} as Record<string, Date[]>;
	for (let i = 0; i < weekStarts.length; i++) {
		const weekStart = weekStarts[i];
		const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
		const datesForWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
		weeks[i] = datesForWeek;
	}
	return weeks;
};

const getCalendarDates = (lastXMonths: number = 6) => {
	const now = new Date();
	const start = subMonths(now, lastXMonths);
	const end = addDays(now, futureBuffer);
	const months = getMonthsInRange(start, end);
	const calendarDates: CalendarDates = {};

	for (let i = 0; i < months.length; i++) {
		const month: Date = months[i];
		const monthStart = startOfMonth(month);
		const monthEnd = endOfMonth(month);
		const monthKey = format(month, "MM/yyyy");
		const weekStarts: Date[] = getWeeksInRange(monthStart, monthEnd);
		const weeks = getWeeks(weekStarts);

		calendarDates[monthKey] = weeks;
	}

	return calendarDates;
};

const getInitialState = () => {
	const now = new Date();
	const month = format(now, "MMMM");
	const year = getYear(now);

	return {
		month,
		year,
	};
};

const baseDate = new Date();
const getInitialSelection = (selection?: SelectedRange) => {
	if (!selection || (!selection.startDate && !selection.endDate)) {
		const weekStart = startOfWeek(baseDate);
		const weekEnd = endOfWeek(baseDate);

		const startDate = formatDate(weekStart, "long");
		const endDate = formatDate(weekEnd, "long");
		return {
			startDate,
			endDate,
		};
	} else {
		return selection;
	}
};

const DateRangeCalendar = ({
	showXMonths = 6,
	onClose,
	onConfirm,
	initialSelection,
}: Props) => {
	// Which month is currently in view
	const [current, setCurrent] = useState<{ month: string; year: number }>({
		...getInitialState(),
	});
	const [selections, setSelections] = useState<SelectedRange>({
		...getInitialSelection(initialSelection),
		// startDate: formatDate(baseDate, 'long'),
		// endDate: formatDate(baseDate, 'long'),
	});
	const calendar = getCalendarDates(showXMonths);
	const months = Object.keys(calendar);

	const selectDate = (date: Date | string) => {
		if (hasStart(selections) && !hasEnd(selections)) {
			setSelections({
				...selections,
				endDate: date,
			});
		} else if (hasBoth(selections)) {
			setSelections({
				startDate: date,
				endDate: null,
			});
		} else {
			setSelections({
				...selections,
				startDate: date,
			});
		}
	};

	const resetSelections = () => {
		setSelections({
			startDate: null,
			endDate: null,
		});
	};
	const cancelSelections = () => {
		return onClose && onClose();
	};
	const confirmSelections = () => {
		const { startDate, endDate } = selections;

		if (startDate && endDate) {
			return onConfirm({
				startDate: startDate,
				endDate: endDate,
			});
		}
	};

	return (
		<div className={styles.DateRangeCalendar}>
			<div className={styles.DateRangeCalendar_header}>
				<CalendarHeader month={current.month} year={current.year} />
			</div>
			<div className={styles.DateRangeCalendar_body}>
				{months &&
					months.map((month, idx) => {
						const weeksInMonth = calendar[month];
						return (
							<MonthDates
								key={`${idx}-${month}`}
								month={month}
								monthData={weeksInMonth}
								onSelect={selectDate}
								selectedRange={selections}
							/>
						);
					})}
			</div>
			<div className={styles.DateRangeCalendar_footer}>
				<CalendarFooter
					onReset={resetSelections}
					onCancel={cancelSelections}
					onConfirm={confirmSelections}
				/>
			</div>
		</div>
	);
};

export default DateRangeCalendar;
