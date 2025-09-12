import styles from "../css/pages/HabitHistoryPage.module.scss";
import { useHabitHistorySummary } from "../hooks/useHabitHistorySummary";
import PageContainer from "../components/layout/PageContainer";
import HabitHistoryCalendar from "../components/habits/HabitHistoryCalendar";
import { useState } from "react";

const HabitHistoryPage = () => {
	const habitID = 1;
	const year = new Date().getFullYear();
	const { data, isLoading } = useHabitHistorySummary(habitID, year);
	const hasData = data?.summary && data?.habit;
	const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
					{!isLoading && hasData && (
						<HabitHistoryCalendar
							habit={data.habit}
							history={data.summary}
							dateRange={data.dateRange}
							onSelect={onSelectDate}
						/>
					)}
				</div>
			</div>
		</PageContainer>
	);
};

export default HabitHistoryPage;
