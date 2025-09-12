import { format } from "date-fns";
import styles from "../../css/habits/HabitHistoryDateDetails.module.scss";
import { Habit, HabitHistoryDay, HabitLog } from "../../features/habits/types";
import { formatCustomDate, parseDate } from "../../utils/utils_dates";

type Props = {
	habit: Habit;
	history: HabitLog[];
	summary: HabitHistoryDay[];
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

const getTotalLogged = (
	goal: number,
	unit: string,
	summary: HabitHistoryDay
) => {
	const { totalLogged } = summary;

	return `${totalLogged} of ${goal} ${unit}`;
};

const getDisplayDate = (summary: HabitHistoryDay[]) => {
	if (!summary || !summary?.length) return "";
	const item = summary?.[0];
	const { loggedDate } = item;
	const parsed = parseDate(loggedDate);
	const displayDate = format(parsed, "EEEE, MMM. do yyyy");

	return displayDate;
};

const HabitHistoryDateDetails = ({
	habit,
	// history,
	summary,
	onClear,
}: Props) => {
	const { habitUnit } = habit;
	const summaryEntry = getSummaryEntry(habit.habitID, summary);
	const goal = summaryEntry.goal || habit.habitTarget;
	const totalLogged = getTotalLogged(goal, habitUnit, summaryEntry);
	const displayDate = getDisplayDate(summary);

	return (
		<div className={styles.HabitHistoryDateDetails}>
			<h2 className={styles.HabitHistoryDateDetails_header}>{displayDate}</h2>
			<div className={styles.HabitHistoryDateDetails_summary}>
				<div>
					You logged <b>{totalLogged}</b> on <b>{summaryEntry.weekDay}</b>
				</div>
			</div>
			<div className={styles.HabitHistoryDateDetails_summary}>
				<button type="button" className={styles.ClearButton} onClick={onClear}>
					Clear
				</button>
			</div>
		</div>
	);
};

export default HabitHistoryDateDetails;
