import styles from "../../css/summary/HabitSummary.module.scss";
import { HabitCard as IHabitCard } from "../../features/habits/types";
import { addEllipsis } from "../../utils/utils_misc";
import DetailsCard from "../layout/DetailsCard";

// SUMMARY CARD FOR DASHBOARD

type Props = {
	habit: IHabitCard;
};

const HabitSummary = ({ habit }: Props) => {
	const title = addEllipsis(habit.habitName, 15);
	return (
		<div className={styles.HabitSummary}>
			<DetailsCard title={title} icon={habit.icon} color={habit.iconColor}>
				{/*  */}
				{/*  */}
			</DetailsCard>
		</div>
	);
};

export default HabitSummary;
