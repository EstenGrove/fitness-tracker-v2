import { useMemo, useState } from "react";
import sprite from "../assets/icons/habits.svg";
import PageContainer from "../components/layout/PageContainer";
import styles from "../css/pages/RecentHabitHistoryPage.module.scss";
import { RecentHabitLog } from "../features/habits/types";
import { useRecentHabitLogs } from "../hooks/useRecentHabitLogs";
import { formatDate, parseAnyDate } from "../utils/utils_dates";
import {
	addEllipsis,
	groupBy,
	groupByFn,
	isEmptyArray,
	TRecord,
} from "../utils/utils_misc";
import Select, { SelectOption } from "../components/shared/Select";
import { habitIcons } from "../utils/utils_habits";
import NavArrows from "../components/layout/NavArrows";
import { format, formatDistanceToNow, isToday, parseISO } from "date-fns";
import Loader from "../components/layout/Loader";
import ModalLG from "../components/shared/ModalLG";

interface IFilter {
	habitID: number;
	habitName: string;
	icon: string;
	iconColor: string;
}

type FiltersProps = {
	filters: IFilter[];
	selectedFilters: IFilter[];
	selectFilter: (filter: IFilter | null) => void;
};

type OptionProps = {
	icon: string;
	color: string;
	isSelected: boolean;
	onSelect: () => void;
};
const FilterOption = ({ icon, onSelect, color, isSelected }: OptionProps) => {
	const iconName = habitIcons[icon as keyof object];
	const css = { fill: color };
	const classes = [styles.FilterOption, isSelected && styles.isSelected].join(
		" "
	);
	return (
		<div className={classes} onClick={onSelect}>
			<svg className={styles.FilterOption_icon} style={css}>
				<use xlinkHref={`${sprite}#icon-${iconName}`}></use>
			</svg>
		</div>
	);
};

const isSelected = (filter: IFilter, selections: IFilter[]) => {
	if (!selections || isEmptyArray(selections)) return false;
	const ids = selections.map(({ habitID }) => habitID);
	return ids.includes(filter.habitID);
};

const Filters = ({ filters, selectedFilters, selectFilter }: FiltersProps) => {
	const noSelections = isEmptyArray(selectedFilters) || !selectedFilters;
	const css = {
		backgroundColor: noSelections ? "var(--accent-blue)" : "initial",
	};
	return (
		<div className={styles.Filters}>
			<div className={styles.Filters_options}>
				<button
					className={styles.Filters_options_all}
					data-selected={noSelections}
					style={css}
					onClick={() => selectFilter(null)}
				>
					All
				</button>
				{filters.map((filter, idx) => {
					const key = `${filter.habitID}-${idx}`;
					return (
						<FilterOption
							key={key}
							icon={filter.icon}
							color={filter.iconColor}
							isSelected={isSelected(filter, selectedFilters)}
							onSelect={() => selectFilter(filter)}
						/>
					);
				})}
			</div>
		</div>
	);
};

// List of habitIDs to show history for (eg, filter by)
type HistoryForList = IFilter[];
// type HistoryForList = RecentHabitLog[]

const filterHabitHistory = (
	allHistory: RecentHabitLog[],
	showHistoryFor: HistoryForList = []
) => {
	// Show all if no filters applied
	if (!showHistoryFor || !showHistoryFor?.length) return allHistory;
	const selectedIDs = showHistoryFor.map(({ habitID }) => habitID);

	return [...allHistory].filter((entry) => {
		const { habitID } = entry;
		return selectedIDs.includes(habitID);
	});
};

const groupHabitHistory = (
	filteredHistory: RecentHabitLog[]
): TRecord<RecentHabitLog> => {
	if (!filteredHistory) return {} as TRecord<RecentHabitLog>;
	const grouped = groupByFn<RecentHabitLog>(
		filteredHistory,
		(entry: RecentHabitLog) => formatDate(entry.logTime, "short")
	);
	return grouped;
};

// Grouped by Icon
const getHabitFiltersFromLogs = (logs: RecentHabitLog[]): IFilter[] => {
	if (!logs || !logs?.length) return [];
	const filters: IFilter[] = [];
	const grouped = groupBy<RecentHabitLog>("habitID", logs);

	for (const key in grouped) {
		const entry = grouped[key];
		const { habitID, habitName, icon, iconColor } = entry[0];
		const filter: IFilter = { habitID, habitName, icon, iconColor };
		filters.push(filter);
	}

	return filters;
};

const dayOptions: SelectOption[] = [3, 7, 14, 30, 45, 60, 90, 120].map(
	(entry) => ({
		label: `Last ${entry} days`,
		value: String(entry),
	})
);

const initialDays: number = 3;

type DateLogProps = {
	log: RecentHabitLog;
	onSelect: () => void;
};
const getWhen = (logEntry: RecentHabitLog) => {
	const today = isToday(logEntry.logTime);
	const when = formatDistanceToNow(logEntry.logTime);
	const ago = when + " ago";
	if (today) {
		return `${ago}`;
	}
	const day = format(logEntry.logTime, "iii");
	const date = format(logEntry.logTime, "M/d");
	return `${ago} (${day}. ${date})`;
};

const DateLog = ({ log, onSelect }: DateLogProps) => {
	const name = addEllipsis(log.habitName, 25);
	const when = getWhen(log);
	const icon = habitIcons[log.icon];
	const color = { fill: log.iconColor };

	return (
		<div className={styles.DateLog} onClick={onSelect}>
			<div className={styles.DateLog_top}>
				<svg className={styles.DateLog_top_icon} style={color}>
					<use xlinkHref={`${sprite}#icon-${icon}`}></use>
				</svg>
				<h4 className={styles.DateLog_top_title}>{name}</h4>
			</div>
			<div className={styles.DateLog_top_when}>{when}</div>
		</div>
	);
};

const getDate = (date: string) => {
	const parsed = parseAnyDate(date);
	const newDate = format(parsed, "eee. MMM do");

	return newDate;
};

type LogsForDateProps = {
	date: string;
	logsForDate: RecentHabitLog[];
	onSelect: (log: RecentHabitLog) => void;
};
const LogsForDate = ({ date, logsForDate, onSelect }: LogsForDateProps) => {
	const logCount = logsForDate?.length ?? 0;
	const logsDate = getDate(date);
	return (
		<div className={styles.LogsForDate}>
			<div className={styles.LogsForDate_heading}>
				<div className={styles.LogsForDate_heading_date}>{logsDate}</div>
				<div className={styles.LogsForDate_heading_count}>
					Total Logs: <b>{logCount}</b>
				</div>
			</div>
			<div className={styles.LogsForDate_logs}>
				{logsForDate.map((log, idx) => {
					return <DateLog key={idx} log={log} onSelect={() => onSelect(log)} />;
				})}
			</div>
		</div>
	);
};

const RecentHabitHistoryPage = () => {
	const targetDate = formatDate(new Date(), "long");
	const [lastXDays, setLastXDays] = useState<number>(initialDays);
	const { data, isLoading } = useRecentHabitLogs(targetDate, initialDays);
	const [selectedLog, setSelectedLog] = useState<RecentHabitLog | null>(null);
	const [showHistoryFor, setShowHistoryFor] = useState<HistoryForList>([]);
	const allHistory = data as RecentHabitLog[];
	const allFilters: IFilter[] = getHabitFiltersFromLogs(
		data as RecentHabitLog[]
	);
	const filteredHistory: TRecord<RecentHabitLog> = useMemo(() => {
		const filtered = filterHabitHistory(allHistory, showHistoryFor);
		const grouped = groupHabitHistory(filtered);
		return grouped;
	}, [allHistory, showHistoryFor]);

	const selectLastXDays = (_: string, days: number | string) => {
		setLastXDays(Number(days));
	};

	const selectFilter = (filter: IFilter | null) => {
		if (!filter || filter === null) {
			return setShowHistoryFor([]);
		}

		const { habitID } = filter;
		const ids = showHistoryFor.map((item) => item.habitID);
		if (ids.includes(habitID)) {
			setShowHistoryFor(
				[...showHistoryFor].filter((entry) => entry.habitID !== habitID)
			);
		} else {
			setShowHistoryFor([...showHistoryFor, filter]);
		}
	};

	const selectLog = (log: RecentHabitLog) => {
		setSelectedLog(log);
	};

	const closeDetails = () => {
		setSelectedLog(null);
	};

	return (
		<PageContainer>
			<div className={styles.RecentHabitHistoryPage}>
				<NavArrows />
				<div className={styles.RecentHabitHistoryPage_top}>
					<h1>Habit History</h1>
				</div>
				<div className={styles.RecentHabitHistoryPage_filters}>
					<div className={styles.RecentHabitHistoryPage_filters_options}>
						<Filters
							filters={allFilters}
							selectFilter={selectFilter}
							selectedFilters={showHistoryFor}
						/>
					</div>
					<div className={styles.RecentHabitHistoryPage_filters_selector}>
						<Select
							name="lastXDays"
							id="lastXDays"
							value={String(lastXDays)}
							onChange={selectLastXDays}
							options={dayOptions}
							style={{ height: "3rem", minWidth: "14rem" }}
						/>
					</div>
				</div>
				<div className={styles.RecentHabitHistoryPage_logs}>
					{isLoading && (
						<Loader>
							<span>Loading history...please wait..</span>
						</Loader>
					)}
					{Object.keys(filteredHistory)?.map((date, idx) => {
						const key = `${date}-${idx}`;
						const logsForDate = filteredHistory[date];
						return (
							<LogsForDate
								key={key}
								date={date}
								logsForDate={logsForDate}
								onSelect={selectLog}
							/>
						);
					})}
				</div>
			</div>

			{selectedLog && (
				<ModalLG onClose={closeDetails}>
					{/*  */}
					{/*  */}
				</ModalLG>
			)}
		</PageContainer>
	);
};

export default RecentHabitHistoryPage;
