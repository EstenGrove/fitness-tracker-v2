import React from "react";
import styles from "../../css/summary/WorkoutHistoryCalendarDetails.module.scss";
import { TodaysWorkout } from "../../features/workouts/types";
import { WorkoutHistory } from "../../features/history/types";
import { WorkoutCalendarDay } from "../../features/summary/types";
import { parseDate } from "../../utils/utils_dates";
import { format } from "date-fns";

type Props = {
	date: string;
	details: WorkoutCalendarDay;
	data: HistoryCalendarDetails;
};

interface HistoryCalendarDetails {
	scheduledWorkouts: TodaysWorkout[];
	performedWorkouts: WorkoutHistory[];
}

const getDisplayDate = (date: string) => {
	const parsed = parseDate(date);
	const display = format(parsed, "EEEE, MMM. do yyyy");
	return display;
};

const getMinsSummary = (details: WorkoutCalendarDay) => {
	if (!details) return "0 mins out of 0 mins.";
	const scheduled = details.totalMinsScheduled;
	const performed = details.totalMinsPerformed;

	return `${performed} minutes out of ${scheduled} scheduled minutes`;
};

const WorkoutHistoryCalendarDetails = ({ details, date, data }: Props) => {
	const displayDate = getDisplayDate(date);
	const minsInfo = getMinsSummary(details);
	return (
		<div className={styles.WorkoutHistoryCalendarDetails}>
			<div className={styles.WorkoutHistoryCalendarDetails_header}>
				<h2>{displayDate}</h2>
			</div>
			<div className={styles.WorkoutHistoryCalendarDetails_main}>
				{minsInfo}
			</div>
		</div>
	);
};

export default WorkoutHistoryCalendarDetails;
