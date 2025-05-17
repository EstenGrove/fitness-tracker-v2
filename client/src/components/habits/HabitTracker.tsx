import sprite from "../../assets/icons/habits.svg";
import styles from "../../css/habits/HabitTracker.module.scss";
import { HabitSummary } from "../../features/habits/types";
import { addEllipsis } from "../../utils/utils_misc";
import { habitIcons } from "../../utils/utils_habits";
import HabitLogger from "./HabitLogger";

type Props = {
	habit: HabitSummary;
};

const mock: HabitSummary = {
	habitID: 2,
	habitName: "Drink More Water",
	icon: "water5",
	iconColor: "var(--accent-blue)",
	intent: "BUILD",
	habitUnit: "fluid ounces",
	habitsLogged: 11,
	habitTarget: 10,
	startDate: new Date(2024, 2, 15).toString(),
	endDate: null,
};

type HeaderProps = {
	habit: HabitSummary;
};

const HabitHeader = ({ habit = mock }: HeaderProps) => {
	const icon = habitIcons[habit.icon];
	const name = addEllipsis(habit.habitName, 20);
	const css = { fill: habit.iconColor };
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

const HabitTracker = ({ habit = mock }: Props) => {
	return (
		<div className={styles.HabitTracker}>
			<HabitHeader habit={habit} />
			<HabitLogger habit={mock} />
		</div>
	);
};

export default HabitTracker;
