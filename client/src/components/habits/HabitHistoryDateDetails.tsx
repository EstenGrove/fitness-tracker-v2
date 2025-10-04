import { format } from "date-fns";
import styles from "../../css/habits/HabitHistoryDateDetails.module.scss";
import {
	Habit,
	HabitHistoryDay,
	HabitIntent,
	HabitLog,
} from "../../features/habits/types";
import { parseDate } from "../../utils/utils_dates";

type Props = {
	habit: Habit;
	history: HabitLog[];
	summary: HabitHistoryDay[];
	selectedDate: string;
	onClear: () => void;
};

const getSummaryEntry = (habitID: number, summary: HabitHistoryDay[]) => {
	if (!summary || !summary.length) {
		return {
			habitID: habitID,
			metGoal: false,
			loggedDate: "",
			totalLogged: 0,
		} as HabitHistoryDay;
	} else {
		return summary[0];
	}
};

const getDisplayDate = (selectedDate: string) => {
	const parsed = parseDate(selectedDate);
	const displayDate = format(parsed, "EEEE, MMM. do yyyy");

	return displayDate;
};

type HistorySummaryProps = {
	habit: Habit;
	summary: HabitHistoryDay;
};

type IntentConditions = {
	[key in HabitIntent]: (total: number, goal: number) => boolean;
};

const getLoggedStyles = (
	totalLogged: number = 0,
	goal: number = 0,
	intent: HabitIntent
) => {
	const conditions: IntentConditions = {
		REDUCE: (total: number, goal: number) => total <= goal,
		BUILD: (total: number, goal: number) => total >= goal,
		ELIMINATE: (total: number) => total <= 0,
		LAPSE: (total: number) => total === 0,
	};

	const checkProgress = conditions[intent];
	const isGood = checkProgress(totalLogged, goal);

	if (!totalLogged) return { color: "var(--blueGrey600)" };

	if (isGood) {
		return {
			color: "var(--accent-green)",
		};
	} else if (!isGood && totalLogged !== 0) {
		return {
			color: "var(--accent-red)",
		};
	}

	// switch (true) {
	// 	case !totalLogged && goal > 0:
	// 	case !totalLogged && !goal: {
	// 		return {
	// 			color: "var(--blueGrey600)",
	// 		};
	// 	}
	// 	case totalLogged <= goal: {
	// 		return {
	// 			color: "var(--accent-green)",
	// 		};
	// 	}
	// 	case totalLogged > goal: {
	// 		return {
	// 			color: "var(--accent-red)",
	// 		};
	// 	}

	// 	default:
	// 		return {
	// 			color: "var(--accent-blue)",
	// 		};
	// }
};

const HistorySummary = ({ habit, summary }: HistorySummaryProps) => {
	const { habitUnit, intent } = habit;
	const goal = summary?.goal ?? habit.habitTarget;
	const totalLogged = summary?.totalLogged ?? 0;
	const css = getLoggedStyles(totalLogged, goal, intent);

	return (
		<div className={styles.HistorySummary}>
			<div>
				You logged{" "}
				<b data-id="total" style={css}>
					{totalLogged}
				</b>{" "}
				of{" "}
				<b data-id="goal">
					{goal} {habitUnit}
				</b>{" "}
				on <b>{summary.weekDay}</b>
			</div>
		</div>
	);
};

const HabitHistoryDateDetails = ({
	habit,
	selectedDate,
	summary,
	onClear,
}: Props) => {
	const summaryEntry = getSummaryEntry(habit.habitID, summary);
	const displayDate = getDisplayDate(selectedDate);

	return (
		<div className={styles.HabitHistoryDateDetails}>
			<h2 className={styles.HabitHistoryDateDetails_header}>{displayDate}</h2>
			<HistorySummary habit={habit} summary={summaryEntry} />
			<div className={styles.HabitHistoryDateDetails_summary}>
				<button type="button" className={styles.ClearButton} onClick={onClear}>
					Clear
				</button>
			</div>
		</div>
	);
};

export default HabitHistoryDateDetails;
