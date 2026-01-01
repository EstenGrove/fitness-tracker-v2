import { useMemo } from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/calendars/ScheduledWorkoutsCalendar.module.scss";
import { useDateCarousel } from "../../hooks/useDateCarousel";
import { useScheduledWorkouts } from "../../hooks/useScheduledWorkouts";
import { formatDate } from "../../utils/utils_dates";
import { format } from "date-fns";
import TodaysWorkout from "../workouts/TodaysWorkout";

// DESIGN:

// <- <Header/> ->
// <ScheduledWorkouts/>

type DateControlProps = {
	currentDate: Date | string;
	onPrev: () => void;
	onNext: () => void;
};

const formatCurrent = (date: Date | string) => {
	const weekday = format(date, "EEEE");
	const fullDesc = format(date, "LLL. do, ");
	const year = format(date, "yyyy");

	return {
		weekday,
		fullDesc,
		year,
	};
};

const DateControls = ({ currentDate, onPrev, onNext }: DateControlProps) => {
	const date = formatCurrent(currentDate);
	return (
		<div className={styles.DateControls}>
			<button
				type="button"
				onClick={onPrev}
				className={styles.DateControls_btn}
			>
				<svg className={styles.DateControls_btn_icon}>
					<use xlinkHref={`${sprite}#icon-arrow_back`}></use>
				</svg>
			</button>

			<div className={styles.DateControls_current}>
				<div className={styles.DateControls_current_weekday}>
					{date.weekday}
				</div>
				<div className={styles.DateControls_current_date}>
					<span data-desc="date">{date.fullDesc}</span>
					<span data-desc="year">{date.year}</span>
				</div>
			</div>

			<button
				type="button"
				onClick={onNext}
				className={styles.DateControls_btn}
			>
				<svg className={styles.DateControls_btn_icon}>
					<use xlinkHref={`${sprite}#icon-arrow_forward`}></use>
				</svg>
			</button>
		</div>
	);
};

const ScheduledWorkoutsCalendar = () => {
	const { data } = useScheduledWorkouts();
	const { currentDate, onPrev, onNext } = useDateCarousel();
	const { grouped } = data;
	const scheduledWorkouts = useMemo(() => {
		if (!grouped || Object.keys(grouped)?.length <= 0) return [];
		const dateKey = formatDate(currentDate, "db");
		if (dateKey in grouped) {
			return grouped[dateKey];
		}
		return [];
	}, [currentDate, grouped]);
	const dateHasWorkouts = scheduledWorkouts && scheduledWorkouts?.length > 0;

	return (
		<div className={styles.ScheduledWorkoutsCalendar}>
			<div className={styles.ScheduledWorkoutsCalendar_header}>
				<DateControls
					currentDate={currentDate}
					onPrev={onPrev}
					onNext={onNext}
				/>
			</div>
			<div className={styles.ScheduledWorkoutsCalendar_workouts}>
				<h1>Scheduled Workouts: {scheduledWorkouts?.length ?? 0}</h1>
				{dateHasWorkouts &&
					scheduledWorkouts.map((workout, idx) => {
						const key = `${workout.workoutID}-${idx}`;
						return <TodaysWorkout key={key} workout={workout} />;
					})}
				{/*  */}
				{/*  */}
				{/*  */}
			</div>
		</div>
	);
};

export default ScheduledWorkoutsCalendar;
