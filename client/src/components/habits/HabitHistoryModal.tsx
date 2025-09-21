import styles from "../../css/habits/HabitHistoryModal.module.scss";
import { Habit, HabitCard } from "../../features/habits/types";
import HabitHistoryCalendarDetails from "./HabitHistoryCalendarDetails";

type Props = {
	habit: Habit | HabitCard;
};

const HabitHistoryModal = ({ habit }: Props) => {
	const habitID = habit.habitID;
	return (
		<div className={styles.HabitHistoryModal}>
			<div className={styles.HabitHistoryModal_header}>
				<h2>Habit History</h2>
			</div>
			<HabitHistoryCalendarDetails habitID={habitID} />
		</div>
	);
};

export default HabitHistoryModal;
