import sprite from "../../assets/icons/main.svg";
import styles from "../../css/dashboard/RecentHistoryTabs.module.scss";
import {
	DashboardSectionTabs,
	DashboardTabButton,
	DashboardTabButtons,
	DashboardTabPanel,
	DashboardTabPanels,
} from "./DashboardSectionTabs";
import { RecentWorkout } from "../../features/dashboard/types";
import { RecentHabitLog } from "../../features/habits/types";
import { addEllipsis, isEmptyArray } from "../../utils/utils_misc";
import { formatDateAsWeekDay, formatDateTime } from "../../utils/utils_dates";
import { format, formatDistanceToNow, isToday } from "date-fns";
import { habitIcons } from "../../utils/utils_habits";
import NoData from "../ui/NoData";

type Props = {
	recentWorkouts: RecentWorkout[];
	recentHabitLogs: RecentHabitLog[];
};

const MinsBadge = ({ mins }: { mins: number }) => {
	return (
		<div className={styles.MinsBadge}>
			<svg className={styles.MinsBadge_icon}>
				<use xlinkHref={`${sprite}#icon-time`}></use>
			</svg>
			<span>{mins}m</span>
		</div>
	);
};

type WhenProps = {
	startTime: string;
};

const WhenBadge = ({ startTime }: WhenProps) => {
	const when = formatDateTime(startTime, "common");
	return (
		<div className={styles.WhenBadge}>
			<span className={styles.WhenBadge}>{when}</span>
		</div>
	);
};

const getWorkoutDate = (startTime: string): string => {
	if (isToday(startTime)) {
		return "Today";
	} else {
		return formatDateAsWeekDay(startTime);
	}
};

const RecentWorkoutEntry = ({ entry }: { entry: RecentWorkout }) => {
	const name = addEllipsis(entry.workoutName, 25);
	const when = getWorkoutDate(entry.workoutDate);
	return (
		<div className={styles.RecentWorkoutEntry}>
			<div className={styles.RecentWorkoutEntry_top}>
				<div className={styles.RecentWorkoutEntry_top_title}>{name}</div>
				<div className={styles.RecentWorkoutEntry_top_when}>{when}</div>
			</div>
			<div className={styles.RecentWorkoutEntry_main}>
				<MinsBadge mins={entry.duration} />
				<WhenBadge startTime={entry.startTime} />
			</div>
		</div>
	);
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

const RecentHabitEntry = ({ entry }: { entry: RecentHabitLog }) => {
	const name = addEllipsis(entry.habitName, 25);
	const when = getWhen(entry);
	const icon = habitIcons[entry.icon];
	const color = { fill: entry.iconColor };
	return (
		<div className={styles.RecentHabitEntry}>
			<div className={styles.RecentHabitEntry_top}>
				<svg className={styles.RecentHabitEntry_top_icon} style={color}>
					<use xlinkHref={`${sprite}#icon-${icon}`}></use>
				</svg>
				<h4 className={styles.RecentHabitEntry_top_title}>{name}</h4>
			</div>
			<div className={styles.RecentHabitEntry_top_when}>{when}</div>
		</div>
	);
};

const RecentWorkouts = ({
	recentWorkouts,
}: {
	recentWorkouts: RecentWorkout[];
}) => {
	const hasWorkouts = !isEmptyArray(recentWorkouts);
	return (
		<div className={styles.RecentWorkouts}>
			{!hasWorkouts && <NoData icon="empty" msg="No recent workouts found." />}
			{hasWorkouts && (
				<div>
					{recentWorkouts.map((entry, idx) => {
						const key = `${entry.historyID}-${idx}`;
						return <RecentWorkoutEntry key={key} entry={entry} />;
					})}
				</div>
			)}
		</div>
	);
};
const RecentHabits = ({ recentHabits }: { recentHabits: RecentHabitLog[] }) => {
	const hasHabits = !isEmptyArray(recentHabits);
	return (
		<div className={styles.RecentWorkouts}>
			{!hasHabits && <NoData icon="empty" msg="No recent habits found." />}
			{hasHabits && (
				<div>
					{recentHabits.map((entry, idx) => {
						return (
							<RecentHabitEntry key={entry.habitID + "-" + idx} entry={entry} />
						);
					})}
				</div>
			)}
		</div>
	);
};

const RecentHistoryTabs = ({
	recentWorkouts = [],
	recentHabitLogs = [],
}: Props) => {
	return (
		<div className={styles.RecentHistoryTabs}>
			<DashboardSectionTabs initialIdx={0}>
				<DashboardTabButtons>
					<DashboardTabButton>
						<span>Recent Workouts</span>
					</DashboardTabButton>
					<DashboardTabButton>
						<span>Recent Habits</span>
					</DashboardTabButton>
				</DashboardTabButtons>
				{/* Panels */}
				<DashboardTabPanels>
					{/* RECENT WORKOUTS */}
					<DashboardTabPanel>
						<RecentWorkouts recentWorkouts={recentWorkouts} />
					</DashboardTabPanel>
					{/* RECENT HABITS */}
					<DashboardTabPanel>
						<RecentHabits recentHabits={recentHabitLogs} />
					</DashboardTabPanel>
				</DashboardTabPanels>
			</DashboardSectionTabs>
		</div>
	);
};

export default RecentHistoryTabs;
