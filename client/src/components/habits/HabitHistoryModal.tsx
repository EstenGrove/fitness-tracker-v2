import styles from "../../css/habits/HabitHistoryModal.module.scss";
import HabitHistoryCalendarDetails from "./HabitHistoryCalendarDetails";

type Props = {
	habitID: number;
};

const HabitHistoryModal = ({ habitID }: Props) => {
	return (
		<div className={styles.HabitHistoryModal}>
			<HabitHistoryCalendarDetails habitID={habitID} />
		</div>
	);
};

export default HabitHistoryModal;
