import { subDays } from "date-fns";
import styles from "../../css/habits/HabitHistory.module.scss";
import {
	HabitHistory as IHabitHistory,
	Habit,
} from "../../features/habits/types";
import { useHabitHistory } from "../../hooks/useHabitHistory";
import ModalLG from "../shared/ModalLG";
import HabitHistoryCalendar from "./HabitHistoryCalendar";

type Props = {
	habit: Habit;
	lastXDays?: number;
	onClose: () => void;
};

const getRangeFromDays = (lastXDays: number) => {
	const end = new Date();
	const start = subDays(end, lastXDays);

	return {
		start,
		end,
	};
};

const HabitHistory = ({ habit, lastXDays = 60, onClose }: Props) => {
	const dateRange = getRangeFromDays(lastXDays);
	const { data, isLoading } = useHabitHistory(habit.habitID);
	const history = data || ([] as IHabitHistory);

	console.log("history", history);
	return (
		<ModalLG onClose={onClose}>
			<div className={styles.HabitHistory}>
				<div className={styles.HabitHistory_header}>
					<h2>History (last {lastXDays} days) </h2>
					{/* CONTROLS, DATE-RANGE, HEADER, CLOSE ICON */}
					{/* CONTROLS, DATE-RANGE, HEADER, CLOSE ICON */}
					{/* CONTROLS, DATE-RANGE, HEADER, CLOSE ICON */}
				</div>
				<div className={styles.HabitHistory_calendar}>
					<HabitHistoryCalendar
						habit={habit}
						history={history}
						dateRange={dateRange}
					/>
				</div>
				<div className={styles.HabitHistory_footer}>
					{/* CLOSE BUTTONS */}
					{/* CLOSE BUTTONS */}
					{/* CLOSE BUTTONS */}
				</div>
			</div>
		</ModalLG>
	);
};

export default HabitHistory;
