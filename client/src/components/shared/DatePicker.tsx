import {
	ChangeEvent,
	ComponentPropsWithoutRef,
	useMemo,
	useRef,
	useState,
} from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/shared/DatePicker.module.scss";
import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	getDate,
	startOfMonth,
	startOfWeek,
	subMonths,
} from "date-fns";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { formatDate, WEEK_DAYS } from "../../utils/utils_dates";

interface DatePickerProps {
	name: string;
	id?: string;
	value: Date | string;
	onChange?: (name: string, value: string) => void;
	onSelect: (name: string, value: Date) => void;
	enableFocusMode?: boolean;
	isDisabled?: boolean;
	isInvalid?: boolean | ((value: Date | string) => boolean);
}
type CalendarProps = {
	dates: Date[];
	selectedDate: string;
	currentMonth: string;
	currentYear: string;
	close: () => void;
	selectDay: (day: Date) => void;
	goToPrev: () => void;
	goToNext: () => void;
	focusMode: boolean;
};
type CalendarDateProps = {
	day: number;
	date: Date;
	currentMonth: string;
	currentYear: string;
	selectDay: () => void;
	isSelected: boolean;
	isDisabled: boolean;
};
type NavButtonProps = {
	goToPrev: () => void;
	goToNext: () => void;
};
type CurrentMonthAndYearProps = {
	currentMonth: string;
	currentYear: string;
};
interface DatePickerState {
	monthStart: string;
	monthEnd: string;
}

const DatePickerNavButtons = ({ goToNext, goToPrev }: NavButtonProps) => {
	return (
		<div className={styles.DatePickerNavButtons}>
			<button
				type="button"
				onClick={goToPrev}
				className={styles.DatePickerNavButtons_prev}
			>
				<svg className={styles.DatePickerNavButtons_prev_icon}>
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_left`}></use>
				</svg>
			</button>
			<button
				type="button"
				onClick={goToNext}
				className={styles.DatePickerNavButtons_next}
			>
				<svg className={styles.DatePickerNavButtons_next_icon}>
					<use xlinkHref={`${sprite}#icon-keyboard_arrow_right`}></use>
				</svg>
			</button>
		</div>
	);
};
// Derived from current state
const getCalendarDates = (currentState: DatePickerState) => {
	const { monthStart, monthEnd } = currentState;
	// add carry over from last month
	const weekStartForMonthStart: Date = startOfWeek(monthStart);
	const weekEndForMonthEnd: Date = endOfWeek(monthEnd);

	const dates: Date[] = eachDayOfInterval({
		start: weekStartForMonthStart,
		end: weekEndForMonthEnd,
	});

	return dates;
};
const getMonthStartAndEnd = (date: Date | string) => {
	const start: Date = startOfMonth(date);
	const end: Date = endOfMonth(date);

	return {
		monthStart: start.toString(),
		monthEnd: end.toString(),
	};
};
const calculateNewState = (date: Date | string): DatePickerState => {
	const newState = getMonthStartAndEnd(date);

	return newState;
};

// Checks if a given date is within our target month & year window
const isInMonth = (date: Date, currentMonth: string, currentYear: string) => {
	const monthForDay: string = format(date, "LLL");
	const yearForDay: string = format(date, "yyyy");

	return (
		monthForDay === currentMonth && Number(yearForDay) === Number(currentYear)
	);
};

const CurrentMonthAndYear = ({
	currentMonth,
	currentYear,
}: CurrentMonthAndYearProps) => {
	return (
		<div className={styles.CurrentMonthAndYear}>
			<div className={styles.CurrentMonthAndYear_month}>{currentMonth}.</div>
			<div className={styles.CurrentMonthAndYear_year}>{currentYear}</div>
		</div>
	);
};
const CalendarDate = ({
	currentMonth,
	currentYear,
	day,
	date,
	selectDay,
	isSelected = false,
	isDisabled = false,
}: CalendarDateProps) => {
	const inMonth = isInMonth(date, currentMonth, currentYear);
	return (
		<button
			type="button"
			onClick={selectDay}
			disabled={isDisabled}
			className={styles.CalendarDate}
			data-outside-month={!inMonth}
			data-datepicker-date={isSelected}
		>
			{day}
		</button>
	);
};
const DatePickerCalendar = ({
	close,
	dates,
	currentMonth,
	currentYear,
	selectDay,
	goToPrev,
	goToNext,
	selectedDate,
	focusMode = true,
}: CalendarProps) => {
	const calendarRef = useRef<HTMLDivElement>(null);
	useOutsideClick(calendarRef, close);

	const weekDayHeaders = WEEK_DAYS.map((day) => day.slice(0, 2));
	return (
		<div
			ref={calendarRef}
			className={
				focusMode
					? `${styles.DatePickerCalendar} ${styles.focusMode}`
					: styles.DatePickerCalendar
			}
		>
			<div className={styles.DatePickerCalendar_header}>
				<CurrentMonthAndYear
					currentMonth={currentMonth}
					currentYear={currentYear}
				/>
				<DatePickerNavButtons goToPrev={goToPrev} goToNext={goToNext} />
			</div>
			<div className={styles.DatePickerCalendar_weekdays}>
				{weekDayHeaders.map((weekday, idx) => (
					<div
						key={`${weekday}-${idx}`}
						className={styles.DatePickerCalendar_weekdays_day}
					>
						{weekday}
					</div>
				))}
			</div>
			<div className={styles.DatePickerCalendar_dates}>
				{dates &&
					dates.map((date) => {
						const day = getDate(date);
						const formatted = formatDate(date, "long");
						return (
							<CalendarDate
								key={day + date.toString()}
								day={day}
								date={date}
								currentMonth={currentMonth}
								currentYear={currentYear}
								selectDay={() => selectDay(date)}
								isSelected={formatted === selectedDate}
								isDisabled={false}
							/>
						);
					})}
			</div>
		</div>
	);
};

// @ts-expect-error: this is fine
interface Props extends DatePickerProps, ComponentPropsWithoutRef<"input"> {}

const getInvalid = (
	selectedDate: Date | string,
	invalidProp?: boolean | ((date: Date | string) => boolean)
): boolean => {
	if (invalidProp) {
		const isFn = typeof invalidProp === "function";

		return isFn ? invalidProp(selectedDate) : invalidProp;
	} else {
		return false;
	}
};

const DatePicker = ({
	name,
	id,
	value = new Date(),
	onSelect,
	onChange,
	enableFocusMode = true,
	isDisabled = false,
	isInvalid = false,
	...rest
}: Props) => {
	const [showCalendar, setShowCalendar] = useState<boolean>(false);
	const selectedDate = useMemo(() => {
		return formatDate(value.toString(), "long");
	}, [value]);

	const [datePicker, setDatePicker] = useState<DatePickerState>({
		monthStart: startOfMonth(value).toString(),
		monthEnd: endOfMonth(value).toString(),
	});
	const currentMonth: string = format(datePicker.monthStart, "LLL");
	const currentYear: string = format(datePicker.monthStart, "yyyy");
	const monthDates: Date[] = useMemo(() => {
		const dates = getCalendarDates(datePicker);
		return dates;
	}, [datePicker]);

	const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value, name } = e.target;
		if (/[0-9/]/.test(value)) return;

		return onChange && onChange(name, value);
	};

	const selectDay = (day: Date) => {
		if (isDisabled) return;
		return onSelect && onSelect(name, day);
	};

	const goToPrev = () => {
		const start = datePicker.monthStart;
		const prevStart = subMonths(start, 1);
		// calculate new state
		const newState = calculateNewState(prevStart);
		setDatePicker(newState);
	};
	const goToNext = () => {
		const start = datePicker.monthStart;
		const nextStart = addMonths(start, 1);
		// calculate new state
		const newState = calculateNewState(nextStart);
		setDatePicker(newState);
	};

	const openCalendar = () => {
		setShowCalendar(true);
	};
	const closeCalendar = () => {
		setShowCalendar(false);
	};

	return (
		<div className={styles.DatePicker}>
			<div className={styles.DatePicker_inputWrapper} {...rest}>
				<input
					type="text"
					name={name}
					id={id}
					value={selectedDate}
					onChange={handleDateChange}
					className={styles.DatePicker_inputWrapper_input}
					disabled={isDisabled}
					aria-invalid={getInvalid(selectedDate, isInvalid)}
					{...rest}
				/>
				<button
					type="button"
					onClick={openCalendar}
					className={styles.DatePicker_inputWrapper_button}
				>
					<svg className={styles.DatePicker_inputWrapper_button_icon}>
						<use xlinkHref={`${sprite}#icon-calendar_today`}></use>
					</svg>
				</button>

				{showCalendar && (
					<DatePickerCalendar
						dates={monthDates}
						goToPrev={goToPrev}
						goToNext={goToNext}
						selectDay={selectDay}
						selectedDate={selectedDate}
						close={closeCalendar}
						currentYear={currentYear}
						currentMonth={currentMonth}
						focusMode={enableFocusMode}
					/>
				)}
			</div>
		</div>
	);
};

export default DatePicker;
