import { useState } from "react";
import styles from "../../css/habits/ReorderModal.module.scss";
import { HabitCard } from "../../features/habits/types";
import Select, { SelectOption } from "../shared/Select";

type Props = {
	habits: HabitCard[];
};

// REQUIREMENTS:
// - Add drag'n'drop support later on
// - For now show select options

type CardOrderProps = {
	name: string;
	value: string;
	onSelect: (name: string, value: string) => void;
	options: SelectOption[];
};

const CardOrder = ({ name, value, onSelect, options = [] }: CardOrderProps) => {
	return (
		<div className={styles.CardOrder}>
			<Select
				name={name}
				id={name}
				value={value}
				onChange={onSelect}
				options={options}
			/>
		</div>
	);
};

const ReorderModal = ({ habits = [] }: Props) => {
	const [order, setOrder] = useState<HabitCard[]>(habits);

	const onSelect = (name: string, value: string) => {
		// do stuf
	};

	return (
		<div className={styles.ReorderModal}>
			<div className={styles.ReorderModal_top}>
				<h2>Reorder Cards</h2>
			</div>
			<div className={styles.ReorderModal_list}>
				{habits &&
					habits.map((habit, idx) => {
						return (
							<CardOrder
								key={idx}
								name={String(habit.habitID)}
								value={String(habit.habitID)}
								onSelect={onSelect}
								options={[]}
							/>
						);
					})}
			</div>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default ReorderModal;
