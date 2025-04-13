import styles from "../../css/layout/WeeklyHeader.module.scss";
import {
	eachDayOfInterval,
	endOfWeek,
	getDate,
	getDay,
	parse,
	startOfWeek,
} from "date-fns";

type Props = {
	baseDate: string;
	onSelect: (day: Date | string) => void;
	selectedDate: string;
};

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const getDaysInWeek = (date: Date | string): Date[] => {
	const daysInWeek: Date[] = eachDayOfInterval({
		start: startOfWeek(date),
		end: endOfWeek(date),
	});

	return daysInWeek;
};

type WeekDayProps = {
	weekDate: Date;
	weekDay: string;
	isSelected: boolean;
	selectDate: () => void;
};

const WeekDay = ({
	weekDay,
	weekDate,
	isSelected,
	selectDate,
}: WeekDayProps) => {
	const date = getDate(weekDate);

	return (
		<button
			type="button"
			className={
				isSelected ? `${styles.WeekDay} ${styles.isSelected}` : styles.WeekDay
			}
			onClick={selectDate}
			data-selected-date={isSelected}
		>
			<div
				className={styles.WeekDay_day}
				style={{
					color: isSelected ? "var(--accent-blue)" : "var(--text1_5)",
				}}
			>
				{weekDay}
			</div>
			<div
				className={styles.WeekDay_date}
				style={{
					color: isSelected ? "var(--accent-blue)" : "#fff",
				}}
			>
				{date}
			</div>
		</button>
	);
};

const isSelectedDate = (
	selectedDate: Date | string,
	weekDate: Date | string
): boolean => {
	const base = selectedDate.toString();
	const parsed = parse(base, "MM-dd-yyyy", new Date());
	const selected = getDate(parsed);
	const date = getDate(weekDate);

	return selected === date;
};

const WeeklyHeader = ({ baseDate, onSelect, selectedDate }: Props) => {
	const daysInWeek: Date[] = getDaysInWeek(baseDate);

	return (
		<div className={styles.WeeklyHeader}>
			<div className={styles.WeeklyHeader_week}>
				{daysInWeek &&
					daysInWeek.map((day: Date, idx: number) => (
						<WeekDay
							key={getDay(day)}
							weekDate={day}
							weekDay={weekDays[idx]}
							selectDate={() => onSelect(day)}
							isSelected={isSelectedDate(selectedDate, day)}
						/>
					))}
			</div>
		</div>
	);
};

export default WeeklyHeader;
