import React from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/habits/HabitMonth.module.scss";
import { parseDate, WEEK_DAYS } from "../../utils/utils_dates";
import { format } from "date-fns";
import { HabitHistoryDay } from "../../features/habits/types";

type Props = {
	data: HabitHistoryDay[];
	goal: number;
	targetDate: string;
};

const augustData = [
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Sunday",
		loggedDate: "2025-07-27",
		totalLogged: 8,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Monday",
		loggedDate: "2025-07-28",
		totalLogged: 8,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Tuesday",
		loggedDate: "2025-07-29",
		totalLogged: 9,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Wednesday",
		loggedDate: "2025-07-30",
		totalLogged: 1,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Thursday",
		loggedDate: "2025-07-31",
		totalLogged: 2,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Friday",
		loggedDate: "2025-08-01",
		totalLogged: 9,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Saturday",
		loggedDate: "2025-08-02",
		totalLogged: 13,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Sunday",
		loggedDate: "2025-08-03",
		totalLogged: 3,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Monday",
		loggedDate: "2025-08-04",
		totalLogged: 6,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Tuesday",
		loggedDate: "2025-08-05",
		totalLogged: 8,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Wednesday",
		loggedDate: "2025-08-06",
		totalLogged: 7,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Thursday",
		loggedDate: "2025-08-07",
		totalLogged: 8,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Friday",
		loggedDate: "2025-08-08",
		totalLogged: 11,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Saturday",
		loggedDate: "2025-08-09",
		totalLogged: 5,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Sunday",
		loggedDate: "2025-08-10",
		totalLogged: 2,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Monday",
		loggedDate: "2025-08-11",
		totalLogged: 7,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Tuesday",
		loggedDate: "2025-08-12",
		totalLogged: 5,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Wednesday",
		loggedDate: "2025-08-13",
		totalLogged: 7,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Thursday",
		loggedDate: "2025-08-14",
		totalLogged: 7,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Friday",
		loggedDate: "2025-08-15",
		totalLogged: 9,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Saturday",
		loggedDate: "2025-08-16",
		totalLogged: 6,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Sunday",
		loggedDate: "2025-08-17",
		totalLogged: 6,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Monday",
		loggedDate: "2025-08-18",
		totalLogged: 7,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Tuesday",
		loggedDate: "2025-08-19",
		totalLogged: 4,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Wednesday",
		loggedDate: "2025-08-20",
		totalLogged: 2,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Thursday",
		loggedDate: "2025-08-21",
		totalLogged: 10,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Friday",
		loggedDate: "2025-08-22",
		totalLogged: 13,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Saturday",
		loggedDate: "2025-08-23",
		totalLogged: 18,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Sunday",
		loggedDate: "2025-08-24",
		totalLogged: 15,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Monday",
		loggedDate: "2025-08-25",
		totalLogged: 14,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Tuesday",
		loggedDate: "2025-08-26",
		totalLogged: 17,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Wednesday",
		loggedDate: "2025-08-27",
		totalLogged: 15,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Thursday",
		loggedDate: "2025-08-28",
		totalLogged: 17,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Friday",
		loggedDate: "2025-08-29",
		totalLogged: 16,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Saturday",
		loggedDate: "2025-08-30",
		totalLogged: 12,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Sunday",
		loggedDate: "2025-08-31",
		totalLogged: 15,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Monday",
		loggedDate: "2025-09-01",
		totalLogged: 18,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Tuesday",
		loggedDate: "2025-09-02",
		totalLogged: 17,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Wednesday",
		loggedDate: "2025-09-03",
		totalLogged: 15,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Thursday",
		loggedDate: "2025-09-04",
		totalLogged: 16,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Friday",
		loggedDate: "2025-09-05",
		totalLogged: 17,
	},
	{
		habitID: 1,
		metGoal: true,
		weekDay: "Saturday",
		loggedDate: "2025-09-06",
		totalLogged: 19,
	},
];

type HabitHeaderProps = {
	month: string;
	year: number;
};

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

const HabitHeader = ({
	month = "September",
	year = 2025,
}: HabitHeaderProps) => {
	const weekdays = [...WEEK_DAYS];
	return (
		<section className={styles.HabitHeader}>
			<div className={styles.HabitHeader_current}>
				<div className={styles.HabitHeader_current_month}>{month}</div>
				<div className={styles.HabitHeader_current_year}>{year}</div>
				<HabitCalendarControls />
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

const getMonthAndYear = (targetDate: string) => {
	const parsed = parseDate(targetDate);
	const month = format(parsed, "MMM");
	const year = parsed.getFullYear();

	return {
		month,
		year,
	};
};

const HabitMonth = ({ data, targetDate }: Props) => {
	const { month, year } = getMonthAndYear(targetDate);
	return (
		<div className={styles.HabitMonth}>
			<HabitHeader month={month} year={year} />
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default HabitMonth;
