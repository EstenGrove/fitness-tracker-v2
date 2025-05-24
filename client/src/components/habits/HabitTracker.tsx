import sprite from "../../assets/icons/habits.svg";
import styles from "../../css/habits/HabitTracker.module.scss";
import {
	Habit,
	HabitFrequency,
	HabitLog,
	HabitSummary,
} from "../../features/habits/types";
import { addEllipsis, sortByDate } from "../../utils/utils_misc";
import { habitIcons } from "../../utils/utils_habits";
import { formatCustomDate, formatTime } from "../../utils/utils_dates";
import HabitLogger from "./HabitLogger";
import { isThisMonth, isThisWeek } from "date-fns";

type Props = {
	habit: Habit;
	summary: HabitSummary;
	allLogs: HabitLog[];
};

type HeaderProps = {
	habit: Habit;
	lastEntry: string;
};

const fallbackMsg = "No logs yet.";

const getLastEntry = (frequency: HabitFrequency, logs: HabitLog[]): string => {
	if (!logs || !logs?.length) return fallbackMsg;
	const sorted: HabitLog[] = sortByDate<HabitLog>("logTime", logs);
	const last: HabitLog = sorted[0];
	const newDate = new Date(last.logTime);

	switch (frequency) {
		case "Daily": {
			const time = formatTime(newDate, "longMs");
			return `Last entry was at ${time}`;
		}
		case "Weekly": {
			const thisWeek = isThisWeek(newDate);
			const dayAndTime = formatCustomDate(newDate, "dayAndTime");
			if (thisWeek) {
				return `Last entry as ${dayAndTime}`;
			}
			return `Last entry was last ${dayAndTime}`;
		}
		case "Monthly": {
			const thisMonth = isThisMonth(newDate);
			const dayAndTime = formatCustomDate(newDate, "monthDayAndTime");
			if (thisMonth) {
				return `Last entry was last month on ${dayAndTime}`;
			}
			const monthDateAndTime = formatCustomDate(newDate, "monthDateAndTime");
			return `Last entry was last month on the ${monthDateAndTime}`;
		}

		default:
			return "Invalid Frequency Type";
	}
};

const HabitHeader = ({ habit, lastEntry }: HeaderProps) => {
	const icon = habitIcons[habit.icon];
	const css = { fill: habit.iconColor };
	const name = addEllipsis(habit.habitName, 20);
	return (
		<div className={styles.HabitHeader}>
			<div className={styles.HabitHeader_title}>
				<svg className={styles.HabitHeader_title_icon} style={css}>
					<use xlinkHref={`${sprite}#icon-${icon}`}></use>
				</svg>
				<div className={styles.HabitHeader_title_name}>{name}</div>
			</div>
			<div className={styles.HabitHeader_title_last}>{lastEntry}</div>
		</div>
	);
};

const HabitTracker = ({ habit, summary, allLogs }: Props) => {
	const lastTaken = getLastEntry(habit.frequency, allLogs);
	return (
		<div className={styles.HabitTracker}>
			<HabitHeader habit={habit} lastEntry={lastTaken ?? ""} />
			<HabitLogger habit={habit} summary={summary} habitStep={1} />
		</div>
	);
};

export default HabitTracker;
