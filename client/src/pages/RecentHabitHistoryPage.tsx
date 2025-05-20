import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import styles from "../css/pages/RecentHabitHistoryPage.module.scss";
import { RecentHabitLog } from "../features/habits/types";
import { useRecentHabitLogs } from "../hooks/useRecentHabitLogs";
import { formatDate } from "../utils/utils_dates";
import { groupBy } from "../utils/utils_misc";
import Select, { SelectOption } from "../components/shared/Select";

const Filters = () => {
	return (
		<div className={styles.Filters}>
			{/*  */}
			{/*  */}
		</div>
	);
};

// List of habitIDs to show history for (eg, filter by)
type HistoryForList = number[];

const filterHabitHistory = (
	allHistory: RecentHabitLog[],
	showHistoryFor: HistoryForList = []
) => {
	// Show all if no filters applied
	if (!showHistoryFor || !showHistoryFor?.length) return allHistory;

	return [...allHistory].filter((entry) =>
		showHistoryFor.includes(entry.habitID)
	);
};

// Grouped by Icon
const getHabitFiltersFromLogs = (logs: RecentHabitLog[]) => {
	if (!logs || !logs?.length) return [];

	return Object.keys(groupBy<RecentHabitLog>("icon", logs)).map((x) =>
		Number(x)
	);
};

const dayOptions: SelectOption[] = [3, 7, 14, 30, 45, 60, 90, 120].map(
	(entry) => ({
		label: `Last ${entry} days`,
		value: String(entry),
	})
);

const initialDays: number = 3;

const RecentHabitHistoryPage = () => {
	const targetDate = formatDate(new Date(), "long");
	const [lastXDays, setLastXDays] = useState<number>(initialDays);
	const { data, isLoading, refetch } = useRecentHabitLogs(
		targetDate,
		initialDays
	);
	const allFilters = getHabitFiltersFromLogs(data as RecentHabitLog[]);
	const [showHistoryFor, setShowHistoryFor] = useState<HistoryForList>([
		...allFilters,
	]);
	const allHistory = data as RecentHabitLog[];
	const filteredHistory: RecentHabitLog[] = useMemo(() => {
		return filterHabitHistory(allHistory, showHistoryFor);
	}, [allHistory, showHistoryFor]);

	const selectLastXDays = (_: string, days: number | string) => {
		setLastXDays(Number(days));
	};

	const selectFilter = (habitID: number) => {
		if (showHistoryFor.includes(habitID)) {
			setShowHistoryFor([...showHistoryFor].filter((id) => id !== habitID));
		} else {
			setShowHistoryFor([...showHistoryFor, habitID]);
		}
	};

	return (
		<PageContainer>
			<div className={styles.RecentHabitHistoryPage}>
				<div className={styles.RecentHabitHistoryPage_top}>
					<h1>Habit History</h1>
				</div>
				<div className={styles.RecentHabitHistoryPage_selector}>
					<Select
						name="lastXDays"
						id="lastXDays"
						value={String(lastXDays)}
						onChange={selectLastXDays}
						options={dayOptions}
					/>
				</div>
				<div className={styles.RecentHabitHistoryPage_filters}>
					<Filters filters={allFilters} />
				</div>
				{/*  */}
				{/*  */}
			</div>
		</PageContainer>
	);
};

export default RecentHabitHistoryPage;
