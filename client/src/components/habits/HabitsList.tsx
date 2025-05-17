import styles from "../../css/habits/HabitsList.module.scss";
import { HabitCardInfo } from "../../features/habits/types";
import HabitCard from "./HabitCard";

type Props = {
	habits: HabitCardInfo[];
};

const fakeHabits: HabitCardInfo[] = [
	{
		habitID: 1,
		habitName: "Smoke Less",
		icon: "smoke2",
		iconColor: "var(--accent-orange)",
		habitUnit: "cigarettes",
		startDate: new Date(2025, 1, 15).toString(),
		endDate: new Date(2025, 6, 5).toString(),
	},
	{
		habitID: 2,
		habitName: "Drink More Water",
		icon: "water5",
		iconColor: "var(--accent-blue)",
		habitUnit: "fl oz.",
		startDate: new Date(2024, 2, 15).toString(),
		endDate: null,
	},
];

const HabitsList = ({ habits = fakeHabits }: Props) => {
	return (
		<div className={styles.HabitsList}>
			<div className={styles.HabitsList_container}>
				{habits &&
					habits.map((habit, idx) => {
						return <HabitCard key={idx} habit={habit} />;
					})}
			</div>
		</div>
	);
};

export default HabitsList;
