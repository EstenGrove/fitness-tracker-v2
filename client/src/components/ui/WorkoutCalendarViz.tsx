import styles from "../../css/ui/WorkoutCalendarViz.module.scss";
import {
	eachDayOfInterval,
	endOfWeek,
	getDate,
	startOfWeek,
	subDays,
} from "date-fns";
import { formatDate, WEEK_DAYS } from "../../utils/utils_dates";

type Props = {
	lastXDays: number;
};

type WorkoutDayProps = {
	day: number;
	date: string;
	value: number;
};

const WorkoutDay = ({ day, date, value }: WorkoutDayProps) => {
	const css = {
		backgroundColor: "rgba(59, 130, 246, 0.3)",
		borderRadius: "50%",
	};
	return (
		<div className={styles.WorkoutDay} data-date={date} data-value={value}>
			<div className={styles.WorkoutDay_date}>{day}</div>
			<div className={styles.WorkoutDay_value} style={css}></div>
		</div>
	);
};

const WeekdayLabels = () => {
	const days: string[] = WEEK_DAYS.map((day) => day.slice(0, 1));

	return (
		<div className={styles.WeekDayLabels}>
			{days &&
				days.map((day, idx) => {
					return (
						<div key={day + idx} className={styles.WeekDayLabels_day}>
							{day}
						</div>
					);
				})}
		</div>
	);
};

const getCalendarDates = (lastXDays: number = 30): Date[] => {
	const today = new Date();
	const end = endOfWeek(today);
	const start = subDays(today, lastXDays);
	const weekStart = startOfWeek(start);
	const dates = eachDayOfInterval({ start: weekStart, end: end });

	return dates;
};

const WorkoutCalendarViz = ({ lastXDays = 30 }: Props) => {
	const calendarDates: Date[] = getCalendarDates(lastXDays);

	console.log("calendarDates", calendarDates);

	return (
		<div className={styles.WorkoutCalendarViz}>
			<div className={styles.WorkoutCalendarViz_labels}>
				<WeekdayLabels />
			</div>
			<div className={styles.WorkoutCalendarViz_days}>
				{calendarDates &&
					calendarDates.map((date, idx) => {
						const dateStr = formatDate(date, "db");
						const monthDay = getDate(date);
						return (
							<WorkoutDay
								key={date + "-" + idx}
								date={dateStr}
								day={monthDay}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default WorkoutCalendarViz;
