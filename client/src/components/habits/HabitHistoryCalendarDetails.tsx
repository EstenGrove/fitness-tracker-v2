import { useState } from "react";
import styles from "../../css/habits/HabitHistoryCalendarDetails.module.scss";
import { useHabitHistorySummary } from "../../hooks/useHabitHistorySummary";
import { HabitYearSummary } from "../../features/habits/types";
import { useHabitHistoryForRange } from "../../hooks/useHabitHistoryForRange";
import HabitHistoryDateDetails from "./HabitHistoryDateDetails";
import HabitHistoryCalendar from "./HabitHistoryCalendar";
import Loader from "../layout/Loader";

type Props = {
	habitID: number;
};

const HabitHistoryCalendarDetails = ({ habitID }: Props) => {
	const year = new Date().getFullYear();
	const { data: summary, isLoading: isLoadingSummary } = useHabitHistorySummary(
		habitID,
		year
	);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const { data: targetHistory, isLoading: isLoadingData } =
		useHabitHistoryForRange({
			habitID: habitID,
			startDate: selectedDate as string,
			endDate: selectedDate as string,
			skip: !selectedDate,
		});

	const historyData = { ...summary } as HabitYearSummary;
	const hasSummaryData = summary?.summary && summary?.habit;
	const hasDateData = targetHistory?.history && targetHistory?.summary;
	const showDateDetails = hasDateData && !isLoadingData && !!selectedDate;

	const onSelectDate = (date: string) => {
		if (selectedDate === date) {
			setSelectedDate(null);
		} else {
			setSelectedDate(date);
		}
	};

	const clearSelectedDate = () => {
		setSelectedDate(null);
	};

	return (
		<div className={styles.HabitHistoryCalendarDetails}>
			{hasSummaryData && !isLoadingSummary && (
				<HabitHistoryCalendar
					habit={historyData.habit}
					history={historyData.summary}
					dateRange={historyData.dateRange}
					onSelect={onSelectDate}
					selectedDate={selectedDate}
				/>
			)}
			{isLoadingData && <Loader />}
			{showDateDetails && (
				<HabitHistoryDateDetails
					habit={targetHistory.habit}
					history={targetHistory.history}
					summary={targetHistory.summary}
					onClear={clearSelectedDate}
					selectedDate={selectedDate}
				/>
			)}
		</div>
	);
};

export default HabitHistoryCalendarDetails;
