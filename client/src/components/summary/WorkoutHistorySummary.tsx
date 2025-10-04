import { useMemo, useState } from "react";
import styles from "../../css/summary/WorkoutHistorySummary.module.scss";
import { useWorkoutHistoryCalendar } from "../../hooks/useWorkoutHistoryCalendar";
import { formatDate } from "../../utils/utils_dates";
import WorkoutHistoryCalendar from "./WorkoutHistoryCalendar";
import { WorkoutCalendarDay } from "../../features/summary/types";
import WorkoutHistoryCalendarDetails from "./WorkoutHistoryCalendarDetails";

const getDetailsForDate = (
	data: WorkoutCalendarDay[],
	selectedDate: string | null
) => {
	if (!selectedDate) return null;
	if (!data || !data?.length) return null;

	const details = data.filter((entry) => {
		return entry.date === selectedDate;
	});

	return details?.[0] as WorkoutCalendarDay;
};

const WorkoutHistorySummary = () => {
	const today = new Date();
	const baseDate = formatDate(today, "db");
	const { data, isLoading } = useWorkoutHistoryCalendar(baseDate);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const calendarData = data?.calendarData;
	const dateDetails = useMemo(() => {
		return getDetailsForDate(calendarData, selectedDate);
	}, [calendarData, selectedDate]);
	const hasDateData = !!selectedDate && !!dateDetails;

	const onSelectDate = (date: string) => {
		if (selectedDate === date) {
			setSelectedDate(null);
		} else {
			setSelectedDate(date);
		}
	};

	return (
		<div className={styles.WorkoutHistorySummary}>
			{calendarData && !isLoading && (
				<WorkoutHistoryCalendar
					data={calendarData}
					onSelect={onSelectDate}
					selectedDate={selectedDate}
				/>
			)}
			{hasDateData && (
				<WorkoutHistoryCalendarDetails
					date={selectedDate}
					details={dateDetails}
					data={{
						scheduledWorkouts: [],
						performedWorkouts: [],
					}}
				/>
			)}
		</div>
	);
};

export default WorkoutHistorySummary;
