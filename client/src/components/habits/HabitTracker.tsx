import sprite from "../../assets/icons/habits.svg";
import styles from "../../css/habits/HabitTracker.module.scss";
import { Habit, HabitSummary } from "../../features/habits/types";
import { addEllipsis } from "../../utils/utils_misc";
import { habitIcons } from "../../utils/utils_habits";
import HabitLogger from "./HabitLogger";

type Props = {
	habit: Habit;
	summary: HabitSummary;
};

type HeaderProps = {
	habit: Habit;
};

const HabitHeader = ({ habit }: HeaderProps) => {
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
		</div>
	);
};

const HabitTracker = ({ habit, summary }: Props) => {
	return (
		<div className={styles.HabitTracker}>
			<HabitHeader habit={habit} />
			<HabitLogger habit={habit} summary={summary} habitStep={1} />
		</div>
	);
};

export default HabitTracker;
