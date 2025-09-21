import styles from "../css/pages/HabitHistoryPage.module.scss";
import PageContainer from "../components/layout/PageContainer";
import { useState } from "react";
import { useWorkoutHistoryCalendar } from "../hooks/useWorkoutHistoryCalendar";
import { formatDate } from "../utils/utils_dates";
import WorkoutHistoryCalendar from "../components/summary/WorkoutHistoryCalendar";

const HabitHistoryPage = () => {
	const today = new Date();
	const baseDate = formatDate(today, "db");
	const { data, isLoading } = useWorkoutHistoryCalendar(baseDate);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const calendarData = data?.calendarData;

	console.log("data", data);
	console.log("calendarData", calendarData);

	const onSelectDate = (date: string) => {
		if (selectedDate === date) {
			setSelectedDate(null);
		} else {
			setSelectedDate(date);
		}
	};

	return (
		<PageContainer>
			<div className={styles.HabitHistoryPage}>
				<div className={styles.HabitHistoryPage_main}>
					{calendarData && !isLoading && (
						<WorkoutHistoryCalendar
							data={calendarData}
							onSelect={onSelectDate}
							selectedDate={selectedDate}
						/>
					)}
					{/* {!isLoading && hasData && (
						<HabitHistoryCalendar
							habit={data.habit}
							history={data.summary}
							dateRange={data.dateRange}
							onSelect={onSelectDate}
						/>
					)} */}
				</div>
			</div>
		</PageContainer>
	);
};

export default HabitHistoryPage;
