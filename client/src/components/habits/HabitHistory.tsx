import styles from "../../css/habits/HabitHistory.module.scss";
import { Habit } from "../../features/habits/types";
import ModalLG from "../shared/ModalLG";
import HabitHistoryCalendarDetails from "./HabitHistoryCalendarDetails";

type Props = {
	habit: Habit;
	onClose: () => void;
};

const HabitHistory = ({ habit, onClose }: Props) => {
	return (
		<ModalLG onClose={onClose}>
			<div className={styles.HabitHistory}>
				<div className={styles.HabitHistory_header}>
					<h2>{habit.habitName} History</h2>
				</div>
				<div className={styles.HabitHistory_calendar}>
					<HabitHistoryCalendarDetails habitID={habit.habitID} />
				</div>
			</div>
		</ModalLG>
	);
};

export default HabitHistory;
