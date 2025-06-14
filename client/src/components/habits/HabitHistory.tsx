import styles from "../../css/habits/HabitHistory.module.scss";
import {
	HabitHistoryDay as IHabitHistoryDay,
	HabitHistory as IHabitHistory,
} from "../../features/habits/types";

type Props = {
	history: IHabitHistory;
};

type HistoryDayProps = {
	historyDay: IHabitHistoryDay;
};

const HistoryDay = ({ historyDay }: HistoryDayProps) => {
	console.log("historyDay", historyDay);
	return (
		<div className={styles.HistoryDay}>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

const HabitHistory = ({ history }: Props) => {
	console.log("history", history);
	return (
		<div className={styles.HabitHistory}>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default HabitHistory;
